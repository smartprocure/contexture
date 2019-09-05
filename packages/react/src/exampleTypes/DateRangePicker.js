import React from 'react'
import _ from 'lodash/fp'
import { contexturify } from '../utils/hoc'

let DateComponent = ({ tree, node, ranges, theme: { Select } }) => (
  <Select
    value={(_.find({ from: node.from, to: node.to }, ranges) || {}).label}
    onChange={event => {
      let value = _.get('target.value', event)
      if (value) {
        let { from, to } = _.find({ label: value }, ranges)
        tree.mutate(node.path, { from, to })
      }
    }}
    options={_.map(x => ({ value: x.label, label: x.label }), ranges)}
  />
)
DateComponent.displayName = 'DateRangePicker'

export default contexturify(DateComponent)
