import React from 'react'
import { observer } from 'mobx-react'
import { exampleTypes } from 'contexture-client'
import injectTreeNode from '../utils/injectTreeNode'
import BarChart from '../layout/BarChart'

let TermsStats = injectTreeNode(
  observer(({ node, ...props }) => (
    <BarChart
      data={node.context.terms}
      categoryField="key"
      valueField={node.order}
      yAxis
      {...props}
    />
  )),
  exampleTypes.TermsStats
)
TermsStats.displayName = 'TermsStats'

export default TermsStats
