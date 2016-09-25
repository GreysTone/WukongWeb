import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import PlayArrowIcon from 'material-ui/svg-icons/av/play-arrow'
import ThumbDownIcon from 'material-ui/svg-icons/action/thumb-down'
import muiThemeable from 'material-ui/styles/muiThemeable'
import {debounce} from 'lodash'

import Volume from './volume'
import Button from './button'
import Action from '../../action'

const kVolumeKey = 'volume'

function mapStateToProps(state) {
  return {
    playing: state.song.playing,
    preload: state.song.preload,
    userId: state.user.id,
    useCdn: state.user.useCdn,
    downvote: state.song.status.downvote
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onPlayOwn(song) {
      dispatch(Action.Song.append.create(song))
    },
    onElapsed(elapsed) {
      dispatch(Action.Song.elapsed.create(elapsed))
    },
    onEnded() {
      dispatch(Action.Song.ended.create())
    },
    onDownvote() {
      dispatch(Action.Song.downvote.create())
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@muiThemeable()
export default class Player extends Component {
  static propTypes = {
    playing: PropTypes.object,
    preload: PropTypes.object,
    userId: PropTypes.string,
    useCdn: PropTypes.bool,
    downvote: PropTypes.bool,
    onPlayOwn: PropTypes.func,
    onElapsed: PropTypes.func,
    onEnded: PropTypes.func,
    onDownvote: PropTypes.func,
    muiTheme: PropTypes.object.isRequired
  }

  state = {
    initialVolume: (() => {
      const volume = parseFloat(localStorage.getItem(kVolumeKey))
      return isNaN(volume) ? 0.5 : volume
    })(),
    isPlaying: false,
    canSetVolume: (() => {
      const audio = document.createElement('audio')
      audio.volume = 0
      return audio.volume == 0
    })(),
    remainingTime: 0
  }

  onPlayAction = (event) => {
    const {playing} = this.refs
    playing.play()
  }

  onVolumeChange = (() => {
    const debouncedSave = debounce(value => {
      localStorage.setItem(kVolumeKey, value.toFixed(2))
    }, 1000)
    return value => {
      const {playing} = this.refs
      playing.volume = value
      debouncedSave(value)
    }
  })()

  onDownvoteAction = (event) => {
    this.props.onDownvote()
  }

  componentDidMount() {
    const {playing} = this.refs
    playing.volume = this.state.initialVolume
    playing.addEventListener('playing', event => {
      this.setState({isPlaying: true})
    })
    playing.addEventListener('pause', event => {
      this.setState({isPlaying: false})
    })
    playing.addEventListener('timeupdate', event => {
      this.setState({remainingTime: playing.duration - playing.currentTime})
      this.props.onElapsed(playing.currentTime)
    })
    playing.addEventListener('ended', event => {
      playing.src = ''
      this.props.onEnded()
    })
    playing.addEventListener('error', event => {
      if (playing.src == '' ||
        !event.target.error ||
        event.target.error.code ===
        event.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED) return
      console.warn('player error, set up reload', event)
      const oldSrc = playing.src
      setTimeout(() => {
        if (oldSrc === playing.src) {
          // trigger hard reload
          console.log('player error reload')
          playing.src = ''
          playing.src = oldSrc
          const {time} = this.props.playing
          playing.currentTime = (Date.now() / 1000) - time
        }
      }, 2500)
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const {playing, preload} = this.refs
    if (this.props.playing.id != prevProps.playing.id ||
        Math.abs(this.props.playing.time - prevProps.playing.time) > 10) {
      const {time, player} = this.props.playing
      const {file, fileViaCdn} = this.props.playing.music
      playing.src = (this.props.useCdn ? fileViaCdn : file) || file
      playing.currentTime = (Date.now() / 1000) - time
      if (file && player && player == this.props.userId) {
        this.props.onPlayOwn(this.props.playing)
      }
    }
    if (this.props.preload != prevProps.preload) {
      const {file, fileViaCdn} = this.props.preload.music
      preload.src = (this.props.useCdn ? fileViaCdn : file) || file
    }
  }

  render() {
    const style = this.generateStyle()
    return (
      <div style={style.toolbar}>
        &#8203;
        {
          this.state.isPlaying
            ? <div style={style.label}>
                {Math.floor(this.state.remainingTime / 60)}
                :
                {`00${Math.floor(this.state.remainingTime % 60)}`.substr(-2)}
              </div>
            : null
        }
        <Button
          icon={ThumbDownIcon}
          disabled={this.props.downvote}
          onAction={this.onDownvoteAction}
        />
        {
          this.state.canSetVolume
            ? <Volume
                onChange={this.onVolumeChange}
                initialValue={this.state.initialVolume}
              />
            : null
        }
        {
          this.props.playing.music && !this.state.isPlaying
            ? <Button
                icon={PlayArrowIcon}
                onAction={this.onPlayAction}
              />
            : null
        }
        <audio ref='playing' autoPlay={true} />
        <audio ref='preload' preload='auto' />
      </div>
    )
  }

  generateStyle() {
    return {
      toolbar: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        marginLeft: 12,
        marginRight: 12
      },
      label: {
        fontSize: this.props.muiTheme.appBar.bodyFontSize,
        padding: 12
      }
    }
  }
}
