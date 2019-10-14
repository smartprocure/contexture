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
  areas,
  gap,
  justifyContent,
  alignContent,
  justifyItems,
  alignItems,
  inline = false,
  style,
  className,
  ...props
}) => (
  <div
    style={{
      display: `${inline ? 'inline-' : ''}grid`,
      gridTemplateColumns: columns,
      gridTemplateRows: rows,
      gridTemplateAreas: formatAreas(areas),
      ...(gap && { gridGap: gap }),
      justifyContent,
      alignContent,
      justifyItems,
      alignItems,
      ...style,
    }}
    className={`gv-grid ${className || ''}`}
    {...props}
  />
)

export default Grid
