import React from 'react'
import { loading as loadingStyle } from '../styles/generic'

let StripedLoader = ({ loading, style = {}, children }) => (
  <div style={{ ...style, ...(loading && loadingStyle) }}>{children}</div>
)

export default StripedLoader
