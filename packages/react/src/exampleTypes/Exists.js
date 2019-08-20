import React from 'react'
import F from 'futil-js'
import _ from 'lodash/fp'
import { contexturify } from '../utils/hoc'
import { withTheme } from '../utils/theme'

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

export default _.flow(contexturify, withTheme)(Exists)
