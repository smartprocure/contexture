import React from 'react'
import { contexturify } from '../utils/hoc'

let TermsStats = ({ node, theme: { BarChart }, ...props }) => (
  <BarChart
    data={node.context.terms}
    categoryField="key"
    valueField={node.order}
    yAxis
    {...props}
  />
)

export default contexturify(TermsStats)
