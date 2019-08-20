import React from 'react'
import F from 'futil-js'
import _ from 'lodash/fp'
import { contexturify } from '../utils/hoc'
import { withTheme } from '../utils/theme'

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

export default _.flow(contexturify, withTheme)(Bool)
