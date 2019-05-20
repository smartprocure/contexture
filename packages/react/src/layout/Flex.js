import React, { Children, cloneElement } from 'react'

export let Flex = ({
  as: Component = 'div',
  style,
  styleItems,
  alignItems,
  alignContent,
  justifyContent,
  wrap = false,
  column = false,
  children,
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
  >
    {Children.map(children, child =>
      child && cloneElement(child, {
        style: { ...styleItems, ...child.props.style },
      })
    )}
  </Component>
)
