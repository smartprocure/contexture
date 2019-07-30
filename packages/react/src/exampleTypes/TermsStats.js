import React from 'react'
import { contexturify } from '../utils/hoc'
import BarChart from '../layout/BarChart'

let TermsStats = contexturify(
  ({ node, ...props }) => (
    <BarChart
      data={node.context.terms}
      categoryField="key"
      valueField={node.order}
      yAxis
      {...props}
    />
  )
)
TermsStats.displayName = 'TermsStats'

export default TermsStats
