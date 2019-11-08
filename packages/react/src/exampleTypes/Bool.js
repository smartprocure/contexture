import React from 'react'
import F from 'futil'
import { contexturify } from '../utils/hoc'

let Bool = ({ tree, node, theme: { RadioList } }) => (
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
