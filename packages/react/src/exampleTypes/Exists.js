import React from 'react'
import F from 'futil'
import { contexturify } from '../utils/hoc'

let Exists = ({ tree, node, theme: { RadioList } }) => (
  <div className="contexture-exists">
    <RadioList
      value={node.value ? 'exists' : 'doesNotExist'}
      onChange={value => {
        tree.mutate(node.path, { value: value === 'exists' })
      }}
      options={F.autoLabelOptions(['exists', 'doesNotExist'])}
    />
  </div>
)

export default contexturify(Exists)
