import React, {PureComponent} from 'react'
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types'

import style from './collapsed-pane.css'

@CSSModules(style)
export default class CollapsedPane extends PureComponent {
  static propTypes = {
    open: PropTypes.bool,
    children: PropTypes.node
  }

  state = {
    height: 'auto'
  }

  updateHeight() {
    this.setState({height: `${this.pane.scrollHeight}px`})
  }

  componentDidMount() {
    this.updateHeight()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.children != prevProps.children) {
      this.updateHeight()
    }
  }

  render() {
    const {open, children} = this.props
    const {height} = this.state
    return (
      <div ref={element => this.pane = element}
        styleName='container' style={{
          height: open ? height : 0
        }}>
        {children}
      </div>
    )
  }
}
