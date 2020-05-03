import React from 'react'
import _ from 'lodash/fp'
import { contexturify } from '../utils/hoc'

let getValue = (value, either) =>
  _.isBoolean(value) ? value : either ? null : false

let Bool = ({
  tree,
  node,
  display = () => ['Yes', 'No', 'Either'],
  theme: { RadioList },
}) => {
  let [yes, no, either] = display()
  return (
    <div className="contexture-bool">
      <RadioList
        value={getValue(node.value, either)}
        onChange={value => {
          tree.mutate(node.path, {
            value: getValue(value, either),
          })
        }}
        options={[
          { label: yes, value: true },
          { label: no, value: false },
          ...(either ? [{ label: either, value: null }] : []),
        ]}
      />
    </div>
  )
}

export default contexturify(Bool)
