import React from 'react'
import _ from 'lodash/fp'
import { contexturify } from '../utils/hoc'

let DateComponent = ({ tree, node, ranges, theme: { Select } }) => (
  <Select
    value={(_.find({ range: node.range }, ranges) || {}).label}
    onChange={event => {
      let value = _.get('target.value', event)
      if (value) {
        let { range } = _.find({ label: value }, ranges)
        tree.mutate(node.path, {
          range,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })
      }
    }}
    options={_.map(x => ({ value: x.label, label: x.label }), ranges)}
  />
)
DateComponent.displayName = 'DateRangePicker'

export default contexturify(DateComponent)
