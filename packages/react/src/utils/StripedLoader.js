import React from 'react'
import { observer } from 'mobx-react'
import { loading } from '../styles/generic'

let StripedLoader = (Component, style = {}) =>
  observer(({ isLoading, ...props }) => (
    <div style={{ height: '100%', ...style, ...(isLoading && loading) }}>
      <Component {...props} />
    </div>
  ))
StripedLoader.displayName = 'StripedLoader'

export default StripedLoader
