import React from 'react'

let GridItem = ({
  column,
  colStart,
  colEnd,
  row,
  rowStart,
  rowEnd,
  children,
  style,
}) => (
  <div
    style={{
      gridColumn: column,
      gridColumnStart: colStart,
      gridColumnEnd: colEnd,
      gridRow: row,
      gridRowStart: rowStart,
      gridRowEnd: rowEnd,
      ...style,
    }}
  >
    {children}
  </div>
)

export default GridItem
