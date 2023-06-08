import React from 'react'

let Flex = React.forwardRef(
  (
    {
      as: Component = 'div',
      style,
      alignItems,
      alignContent,
      justifyContent,
      wrap = false,
      column = false,
      inline = false,
      ...props
    },
    ref
  ) => (
    <Component
      ref={ref}
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
)

export default Flex
