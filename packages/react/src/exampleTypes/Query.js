import React from 'react'
import { contexturify } from '../utils/hoc'

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

export default contexturify(Query)
