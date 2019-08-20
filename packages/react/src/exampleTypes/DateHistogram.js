import React from 'react'
import { contexturify } from '../utils/hoc'
import _ from 'lodash/fp'
import { withTheme } from '../utils/theme'

let DateHistogram = _.flow(contexturify, withTheme)(({ node, theme: { BarChart }, ...props }) => (
  <BarChart
    data={node.context.entries}
    categoryField="key"
    valueField="count"
    gutter={0}
    {...props}
  />
))
DateHistogram.displayName = 'DateHistogram'

export default DateHistogram
