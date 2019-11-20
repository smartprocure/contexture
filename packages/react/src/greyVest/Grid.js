import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'

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
  placeContent,
  placeItems,
  inline = false,
  style,
  ...props
}) => (
  <Component
    style={{
      display: `${inline ? 'inline-' : ''}grid`,
      gridTemplateColumns: repeatNumber(columns),
      gridTemplateRows: repeatNumber(rows),
      gridTemplateAreas: formatAreas(areas),
      gridGap: gap,
      placeContent,
      placeItems,
      ...style,
    }}
    {...props}
  />
)

export default Grid
