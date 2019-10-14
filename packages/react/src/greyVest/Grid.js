import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'

let formatAreas = _.flow(
  _.map(F.quote),
  _.join(' ')
)

let repeatNumber = F.when(_.isNumber, x => `repeat(${x}, 1fr)`)

let Grid = ({
  as: Component = 'div',
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
  <Component
    style={{
      display: `${inline ? 'inline-' : ''}grid`,
      gridTemplateColumns: repeatNumber(columns),
      gridTemplateRows: repeatNumber(rows),
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
