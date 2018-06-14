import React from 'react'
import {observer} from 'mobx-react'
import {exampleTypes} from 'contexture-client'
import injectTreeNode from '../utils/injectTreeNode'
import _ from 'lodash/fp'

let DefaultSelect = ({options, value, onChange}) => (
  <select
    value={value}
    onChange={e => {
      onChange(e.target.value)
    }}>
    {_.map(
      x => (
        <option key={x.value} value={x.value}>
          {x.label}
        </option>
      ),
      options
    )}
  </select>
)

let DateComponent = injectTreeNode(
  observer(({tree, node, ranges, Select = DefaultSelect}) => (
    <Select
      value={(_.find({from: node.from, to: node.to}, ranges) || {}).label}
      onChange={x => {
        let {from, to} = _.find({label: x}, ranges)
        tree.mutate(node.path, {from, to})
      }}
      options={_.map(x => ({value: x.label, label: x.label}), ranges)}
    />
  )),
  exampleTypes.date
)
DateComponent.displayName = 'DateRangePicker'

export default DateComponent
