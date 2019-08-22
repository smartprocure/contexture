import React from 'react'
import { observer } from 'mobx-react'
import { loading as loadingStyle } from '../styles/generic'

let StripedLoader = observer(({ loading, style = {}, children }) => (
  <div style={{ ...style, ...(loading && loadingStyle) }}>{children}</div>
))
StripedLoader.displayName = 'StripedLoader'

export default StripedLoader
