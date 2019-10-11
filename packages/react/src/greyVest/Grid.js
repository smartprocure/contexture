import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'

let formatAreas = _.flow(
  _.map(F.quote),
  _.join(' ')
)

let Grid = ({
  columns,
  rows,
  autoColumns,
  autoRows,
  autoFlow,
  areas,
  gap,
  columnGap,
  rowGap,
  justifyContent,
  alignContent,
  style,
  className,
  ...props
}) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: columns,
      gridTemplateRows: rows,
      gridAutoColumns: autoColumns,
      gridAutoRows: autoRows,
      gridAutoFlow: autoFlow,
      gridTemplateAreas: formatAreas(areas),
      ...(gap && { gridGap: gap }),
      ...(columnGap && { columnGap }),
      ...(rowGap && { rowGap }),
      justifyContent,
      alignContent,
      ...style,
    }}
    className={`gv-grid ${className || ''}`}
    {...props}
  />
)

export default Grid
