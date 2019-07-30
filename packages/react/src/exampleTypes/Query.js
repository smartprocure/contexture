import React from 'react'
import { contexturify } from '../utils/hoc'

let Query = contexturify(
  ({ tree, node, TextInput = 'input' }) => (
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
)
Query.displayName = 'Query'

export default Query
