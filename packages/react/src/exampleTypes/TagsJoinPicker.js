import React from 'react'
import { observer } from 'mobx-react'
import DefaultSelect from '../layout/Select'

export let tagToGroupJoin = (x = 'any') =>
  ({
    any: 'or',
    all: 'and',
    none: 'not',
  }[x])

let joinOptions = [
  { value: 'any', label: 'Match any of these keywords' },
  { value: 'all', label: 'Match all of these keywords' },
  { value: 'none', label: 'Match none of these keywords' }
]

let TagsJoinPicker = ({ node, tree, Select = DefaultSelect }) =>
  <Select
    value={node.join}
    onChange={e => tree.mutate(node.path, { join: e.target.value })}
    options={joinOptions}
  />

export default observer(TagsJoinPicker)