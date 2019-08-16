import React from 'react'

let HighlightWrap = ({ props, style }) => (
  <b style={{ backgroundColor: 'yellow', ...style }} {...props} />
)

export default HighlightWrap
