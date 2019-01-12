import React from 'react'
import F from 'futil-js'
import { observer } from 'mobx-react'
import { exampleTypes } from 'contexture-client'
import injectTreeNode from '../utils/injectTreeNode'
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

export default injectTreeNode(observer(Exists), exampleTypes.exists)
