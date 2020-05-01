import React from 'react'
import F from 'futil'
import { contexturify } from '../utils/hoc'

let Exists = ({
  tree,
  node,
  options = ['exists', 'doesNotExist'],
  theme: { RadioList },
}) => (
  <div className="contexture-exists">
    <RadioList
      value={node.value ? options[0] : options[1]}
      onChange={value => {
        tree.mutate(node.path, { value: value === options[0] })
      }}
      options={F.autoLabelOptions(options)}
    />
  </div>
)

export default contexturify(Exists)
