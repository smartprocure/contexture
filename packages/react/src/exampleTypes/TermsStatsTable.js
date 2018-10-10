import _ from 'lodash/fp'
import React from 'react'
import { observer } from 'mobx-react'
import { exampleTypes } from 'contexture-client'
import injectTreeNode from '../utils/injectTreeNode'
import ExpandableTable from '../layout/ExpandableTable'

let TermsStatsTable = injectTreeNode(
  observer(({ node, columns, ...props }) => (
    <ExpandableTable
      {...props}
      data={node.context.terms}
      columns={
        columns ||
        _.flow(
          _.first,
          _.keys,
          _.map(field => ({ field }))
        )(node.context.terms)
      }
    />
  )),
  exampleTypes.TermsStats
)
TermsStatsTable.displayName = 'TermsStatsTable'

export default TermsStatsTable
