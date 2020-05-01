import React from 'react'
import F from 'futil'
import { contexturify } from '../utils/hoc'

let Bool = ({ tree, node, options = ['yes', 'no'], theme: { RadioList } }) => (
  <div className="contexture-bool">
    <RadioList
      value={node.value ? options[0] : options[1]}
      onChange={value => {
        tree.mutate(node.path, { value: value === options[0] })
      }}
      options={F.autoLabelOptions(options)}
    />
  </div>
)

export default contexturify(Bool)
