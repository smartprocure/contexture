import React from 'react'

export default ({ style = {}, ...props }) => (
  <input
    style={{
      padding: '5px',
      textIndent: '5px',
      margin: '5px auto',
      ...style,
    }}
    {...props}
  />
)
