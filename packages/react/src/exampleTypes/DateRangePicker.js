import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import { exampleTypes } from 'contexture-client'
import injectTreeNode from '../utils/injectTreeNode'
import DefaultSelect from '../layout/Select'

let DateComponent = injectTreeNode(
  observer(({ tree, node, ranges, Select = DefaultSelect }) => (
    <Select
      value={(_.find({ from: node.from, to: node.to }, ranges) || {}).label}
      onChange={event => {
        let value = _.get('target.value', event)
        if(value) {
          let { from, to } = _.find({ label: value }, ranges)
          tree.mutate(node.path, { from, to })
        }
      }}
      options={_.map(x => ({ value: x.label, label: x.label }), ranges)}
    />
  )),
  exampleTypes.date
)
DateComponent.displayName = 'DateRangePicker'

export default DateComponent
