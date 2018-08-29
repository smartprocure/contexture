import React from 'react'
import { observer } from 'mobx-react'
import { loading } from '../styles/generic'

let StripedLoader = (Component, style = {}) =>
  observer(props => (
    <div style={{ ...style, ...(props.loading && loading) }}>
      <Component {...props} />
    </div>
  ))
StripedLoader.displayName = 'StripedLoader'

export default StripedLoader
