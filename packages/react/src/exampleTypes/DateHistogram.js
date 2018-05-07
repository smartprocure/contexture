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
      format = _.identity,
      height = 100,
      background = () => '#ccc',
    }) =>
      <BarChart
        data={node.context.entries}
        categoryField='key'
        valueField='count'
        yAxis={false}
        gutter={0}
        {...{format, height, background}}
      />
  ),
  exampleTypes.dateHistogram
)
DateHistogram.displayName = 'DateHistogram'

export default DateHistogram
