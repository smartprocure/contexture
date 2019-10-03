import React from 'react'

let Grid = ({ style, columns, rows, gap, ...props }) => (
  <div
    style={{
      display: 'grid',
      ...(columns && {
        gridTemplateColumns: columns,
        msGridTemplateColumns: columns,
      }),
      ...(rows && {
        gridTemplateRows: rows,
        msGridTemplateRows: rows,
      }),
      ...(gap && { gridGap: gap }),
      ...style,
    }}
    {...props}
  />
)

export default Grid
