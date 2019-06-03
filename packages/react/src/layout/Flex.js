import React from 'react'

export let Flex = ({
  as: Component = 'div',
  style,
  alignItems,
  alignContent,
  justifyContent,
  wrap = false,
  column = false,
  ...props
}) => (
  <Component
    style={{
      display: 'flex',
      flexWrap: wrap && 'wrap',
      flexDirection: column && 'column',
      alignItems,
      justifyContent,
      alignContent,
      ...style,
    }}
    {...props}
  />
)
