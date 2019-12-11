import React from 'react'

let Flex = ({
  as: Component = 'div',
  style,
  alignItems,
  alignContent,
  justifyContent,
  wrap = false,
  column = false,
  inline = false,
  ...props
}) => (
  <Component
    style={{
      display: `${inline ? 'inline-' : ''}flex`,
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

export default Flex
