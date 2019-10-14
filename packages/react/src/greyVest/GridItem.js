import React from 'react'

let GridItem = ({
  as: Component = 'div',
  column,
  row,
  area,
  width,
  height,
  place,
  style,
  ...props
}) => (
  <Component
    style={{
      gridColumn: column,
      ...(width && { gridColumnEnd: `span ${width}` }),
      gridRow: row,
      ...(top && { gridRowStart: top }),
      ...(height && { gridRowEnd: `span ${height}` }),
      ...(area && { gridArea: area }),
      placeSelf: place,
      ...style,
    }}
    {...props}
  />
)

export default GridItem
