import React from 'react'
import F from 'futil-js'
import { contexturify } from '../utils/hoc'
import RadioListDefault from '../layout/RadioList'

let Bool = ({ tree, node, RadioList = RadioListDefault }) => (
  <div className="contexture-bool">
    <RadioList
      value={node.value ? 'yes' : 'no'}
      onChange={value => {
        tree.mutate(node.path, { value: value === 'yes' })
      }}
      options={F.autoLabelOptions(['yes', 'no'])}
    />
  </div>
)

export default contexturify(Bool)
