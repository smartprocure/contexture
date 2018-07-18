import React from 'react'
import { observer } from 'mobx-react'
import { loading } from '../styles/generic'

export default (Component, style = {}) =>
  observer(props => (
    <div style={{ ...style, ...(props.loading && loading) }}>
      <Component {...props} />
    </div>
  ))
