import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import { exampleTypes } from 'contexture-client'
import { Flex } from '../layout/Flex'
import injectTreeNode from '../utils/injectTreeNode'
import BarChart from '../layout/BarChart'

let TermsStats = injectTreeNode(
  observer(
    ({
      node,
      format = _.identity,
      height = 100,
      background = () => '#ccc',
    }) =>
      <BarChart
        data={node.context.terms}
        categoryField='key'
        valueField={node.order}
        yAxis
        {...{format, height, background}}
      />
  ),
  exampleTypes.TermsStats
)
TermsStats.displayName = 'TermsStats'

export default TermsStats
