import React from 'react'
import _ from 'lodash/fp'
import { contexturify } from '../utils/hoc'
import { withTheme } from '../utils/theme'

let Query = ({ tree, node, theme: { TextInput } }) => (
  <TextInput
    value={node.query || ''}
    onChange={e =>
      tree.mutate(node.path, {
        query: e.target.value,
      })
    }
    placeholder="Search"
  />
)
Query.displayName = 'Query'

export default _.flow(
  contexturify,
  withTheme
)(Query)
