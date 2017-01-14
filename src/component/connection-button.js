import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import CSSModules from 'react-css-modules'

import Action from '../action'
import ButtonItem from './button-item'
import style from './connection-button.css'

function mapStateToProps(state) {
  return {
    connection: state.user.preferences.connection
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchConnection(connection) {
      dispatch(Action.User.preferences.create({connection}))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class ConnectionButton extends PureComponent {
  static propTypes = {
    connection: PropTypes.number,
    dispatchConnection: PropTypes.func
  }

  onButtonAction = (event) => {
    this.setState({open: true})
  }

  render() {
    const {connection} = this.props
    return (
      <ButtonItem icon='plug'
        action={this.onButtonAction}/>
    )
  }
}
