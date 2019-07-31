import React from 'react'
import F from 'futil-js'
import { contexturify } from '../utils/hoc'
import RadioListDefault from '../layout/RadioList'

let Exists = ({ tree, node, RadioList = RadioListDefault }) => (
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

export default contexturify(Exists, 'exists')
