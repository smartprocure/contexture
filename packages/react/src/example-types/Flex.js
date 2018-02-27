import React from 'react'

export let Flex = ({ children, style, ...props }) => (
  <div style={{ display: 'flex', ...style }} {...props}>
    {children}
  </div>
)
