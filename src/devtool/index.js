import React from 'react'
import {createDevTools} from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'

export default createDevTools(
  <DockMonitor
    defaultPosition='bottom'
    defaultIsVisible={false}
    toggleVisibilityKey='ctrl-h'
    changePositionKey='ctrl-q'>
    <LogMonitor theme='tomorrow'/>
  </DockMonitor>
)
