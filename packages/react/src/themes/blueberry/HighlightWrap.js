import React from 'react'

let HighlightWrap = ({ style = {}, ...props }) => (
  <b style={{ backgroundColor: 'yellow', ...style }} {...props} />
)

export default HighlightWrap
