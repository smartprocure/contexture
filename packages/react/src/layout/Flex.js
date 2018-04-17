import React from 'react'

// TODO: align items/content/justify/etc support
export let Flex = ({ style, ...props }) => (
  <div style={{ display: 'flex', ...style }} {...props} />
)
