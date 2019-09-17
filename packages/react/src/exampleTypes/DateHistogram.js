import React from 'react'
import { contexturify } from '../utils/hoc'

let DateHistogram = ({ node, theme: { BarChart }, ...props }) => (
  <BarChart
    data={node.context.entries}
    categoryField="key"
    valueField="count"
    gutter={0}
    {...props}
  />
)

export default contexturify(DateHistogram)
