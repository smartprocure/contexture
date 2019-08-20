import React from 'react'
import { contexturify } from '../utils/hoc'
import _ from 'lodash/fp'
import { withTheme } from '../utils/theme'

let TermsStats = ({ node, theme: { BarChart }, ...props }) => (
  <BarChart
    data={node.context.terms}
    categoryField="key"
    valueField={node.order}
    yAxis
    {...props}
  />
)

export default _.flow(
  contexturify,
  withTheme
)(TermsStats)
