import React from 'react'
import { contexturify } from '../utils/hoc'
import BarChart from '../layout/BarChart'

let DateHistogram = contexturify(
  ({ node, ...props }) => (
    <BarChart
      data={node.context.entries}
      categoryField="key"
      valueField="count"
      gutter={0}
      {...props}
    />
  )
)
DateHistogram.displayName = 'DateHistogram'

export default DateHistogram
