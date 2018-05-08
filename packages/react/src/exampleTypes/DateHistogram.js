import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import { exampleTypes } from 'contexture-client'
import injectTreeNode from '../utils/injectTreeNode'
import BarChart from '../layout/BarChart'

let DateHistogram = injectTreeNode(
  observer(
    ({
      node,
      background = () => '#ccc',
      ...props
    }) =>
      <BarChart
        data={node.context.entries}
        categoryField='key'
        valueField='count'
        gutter={0}
        {...{background}}
        {...props}
      />
  ),
  exampleTypes.dateHistogram
)
DateHistogram.displayName = 'DateHistogram'

export default DateHistogram
