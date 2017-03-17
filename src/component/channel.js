import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'
import DocumentTitle from 'react-document-title'

import Action from '../action'
import ChannelTitle from './channel-title'
import MemberList from './member-list'
import NowPlaying from './now-playing'
import LyricsMarquee from './lyrics-marquee'
import ActionPanel from './action-panel'
import OmniPanel from './omni-panel'
import SongList from './song-list'
import PlayerAudio from './player-audio'
import PreloadControl from './preload-control'
import AppFooter from './footer'
import style from './channel.css'

function mapStateToProps(state, props) {
  return {
    channel: props.match.params.channel
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchChannel(channel) {
      dispatch(Action.Channel.name.create(channel))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class Channel extends PureComponent {
  static propTypes = {
    channel: PropTypes.string,
    dispatchChannel: PropTypes.func
  }

  updateChannel() {
    this.props.dispatchChannel(this.props.channel)
  }

  componentDidMount() {
    this.updateChannel()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.channel != prevProps.channel) {
      this.updateChannel()
    }
  }

  render() {
    const {channel} = this.props
    return (
      <DocumentTitle title={`Wukong#${channel}`}>
        <div styleName='container'>
          <div styleName='left' style={{top: 0, zIndex: 10}}> {/* FIXME */}
            <ChannelTitle/>
          </div>
          <div styleName='right'>
            <MemberList/>
          </div>
          <div styleName='left' style={{top: 0, paddingTop: 52}}>
            <div styleName='left-content'>
              <NowPlaying/>
              <LyricsMarquee/>
              <ActionPanel/>
            </div>
            <AppFooter/>
          </div>
          <div styleName='right'>
            <OmniPanel/>
            <SongList/>
          </div>
          <PlayerAudio/>
          <PreloadControl/>
        </div>
      </DocumentTitle>
    )
  }
}
