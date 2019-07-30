import React from 'react'
import F from 'futil-js'
import _ from 'lodash/fp'
import { withNode, withLoader } from '../utils/hoc'
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

export default _.flow(withNode, withLoader)(Bool)
