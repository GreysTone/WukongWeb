import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'

import Selector from '../selector'
import style from './background.css'

function mapStateToProps(state) {
  return {
    artwork: Selector.playingArtwork(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class Background extends PureComponent {
  static propTypes = {
    artwork: PropTypes.string
  }

  render() {
    const {artwork} = this.props
    return (
      <div styleName='container' style={{
        backgroundImage: `url(${artwork})`
      }}/>
    )
  }
}
