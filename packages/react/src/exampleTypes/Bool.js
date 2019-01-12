import React from 'react'
import F from 'futil-js'
import { observer } from 'mobx-react'
import { exampleTypes } from 'contexture-client'
import injectTreeNode from '../utils/injectTreeNode'
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

export default injectTreeNode(observer(Bool), exampleTypes.bool)