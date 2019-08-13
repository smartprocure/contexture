import React from 'react'

let Grid = ({ style, columns, gap, ...props }) => (
  <div
    style={{
      display: 'grid',
      ...(columns && {
        gridTemplateColumns: columns,
        msGridTemplateColumns: columns,
      }),
      ...(gap && { gridGap: gap }),
      ...style,
    }}
    {...props}
  />
)

export default Grid
