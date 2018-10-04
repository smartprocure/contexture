import _ from 'lodash/fp'
import React from 'react'
import { observer } from 'mobx-react'
import { exampleTypes } from 'contexture-client'
import injectTreeNode from '../utils/injectTreeNode'
import BarChart from '../layout/BarChart'
import Table from '../layout/Table'

let TermsStats = injectTreeNode(
  observer(
    ({ node, layout, ...props }) =>
      layout === 'table' ? (
        <Table
          {...props}
          data={node.context.terms}
          columns={
            props.columns ||
            _.flow(
              _.first,
              _.keys,
              _.map(field => ({ field }))
            )(node.context.terms)
          }
        />
      ) : (
        <BarChart
          data={node.context.terms}
          categoryField="key"
          valueField={node.order}
          yAxis
          {...props}
        />
      )
  ),
  exampleTypes.TermsStats
)
TermsStats.displayName = 'TermsStats'

export default TermsStats
