import React from 'react'

let GridItem = ({
  // CSS API
  column,
  row,
  area,
  width,
  height,
  placeSelf,
  style,
  className,
  ...props
}) => (
  <div
    style={{
      gridColumn: column,
      ...(width && { gridColumnEnd: `span ${width}` }),
      gridRow: row,
      ...(top && { gridRowStart: top }),
      ...(height && { gridRowEnd: `span ${height}` }),
      ...(area && { gridArea: area }),
      placeSelf,
      ...style,
    }}
    className={`gv-grid-item ${className || ''}`}
    {...props}
  />
)

export default GridItem
