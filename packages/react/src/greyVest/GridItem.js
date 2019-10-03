import React from 'react'

let GridItem = ({
  column,
  colStart,
  colEnd,
  colSpan,
  row,
  rowStart,
  rowSpan,
  rowEnd,
  children,
  style,
}) => (
  <div
    style={{
      gridColumn: column,
      gridColumnStart: colStart,
      gridColumnEnd: colEnd || (!!colSpan && `span ${colSpan}`),
      gridRow: row,
      gridRowStart: rowStart,
      gridRowEnd: rowEnd || (!!rowSpan && `span ${rowSpan}`),
      ...style,
    }}
  >
    {children}
  </div>
)

export default GridItem
