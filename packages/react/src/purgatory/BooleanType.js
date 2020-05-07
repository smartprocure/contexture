import React from 'react'
import _ from 'lodash/fp'
import { contexturify } from '../utils/hoc'

let getValue = value => (_.isNil(value) ? null : !!value)

let BooleanType = ({
  tree,
  node,
  display = value => (_.isNil(value) ? 'Either' : value ? 'Yes' : 'No'),
  className = 'contexture-bool',
  theme: { RadioList },
}) => (
  <div className={className}>
    <RadioList
      value={getValue(node.value)}
      onChange={value => {
        tree.mutate(node.path, {
          value: getValue(value),
        })
      }}
      options={[
        { label: display(true), value: true },
        { label: display(false), value: false },
        { label: display(null), value: null },
      ]}
    />
  </div>
)

export default contexturify(BooleanType)
