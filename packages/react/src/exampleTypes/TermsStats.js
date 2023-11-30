import React from 'react'
import { contexturify } from '../utils/hoc.js'

let TermsStats = ({ node, theme: { BarChart }, ...props }) => (
  <BarChart
    data={node.context?.terms ?? node.context?.results}
    categoryField="key"
    valueField={node.order}
    yAxis
    {...props}
  />
)

export default contexturify(TermsStats)
