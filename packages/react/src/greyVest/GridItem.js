import React from 'react'

let middleStyle = {
  display: 'inline-flex',
  flexFlow: 'column wrap',
  justifyContent: 'center',
  justifySelf: 'stretch',
}

let GridItem = ({
  // CSS API
  column,
  columnStart,
  columnEnd,
  row,
  rowStart,
  rowEnd,
  area,

  // fancy extra stuff
  width = 1, // alias for column-end span
  height = 1, // alias for row-end span
  left = columnStart, // alias for column-start
  top = rowStart, // alias for row-start
  middle,
  center,

  style,
  className,
  ...props
}) => (
  <div
    style={{
      gridColumn: column,
      gridColumnStart: left,
      gridColumnEnd: columnEnd || `span ${width}`,
      gridRow: row,
      ...(top && { gridRowStart: top }),
      gridRowEnd: rowEnd || `span ${height}`,
      ...(area && { gridArea: area }),
      textAlign: center && 'center',
      ...(middle && middleStyle),
      ...style,
    }}
    className={`gv-grid-item ${className || ''}`}
    {...props}
  />
)

export default GridItem
