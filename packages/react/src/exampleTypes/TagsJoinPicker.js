import React from 'react'
import { observer } from 'mobx-react'
import _ from 'lodash/fp'
import { withTheme } from '../utils/theme'

export let tagToGroupJoin = (x = 'any') =>
  ({
    any: 'or',
    all: 'and',
    none: 'not',
  }[x])

let defaultJoinOptions = [
  { value: 'any', label: 'Match any of these keywords' },
  { value: 'all', label: 'Match all of these keywords' },
  { value: 'none', label: 'Match none of these keywords' },
]

let getJoinOptions = options =>
  _.size(options)
    ? _.filter(
        option => _.includes(_.get('value', option), options),
        defaultJoinOptions
      )
    : defaultJoinOptions

let TagsJoinPicker = ({ node, tree, theme: { Select }, joinOptions = [] }) => (
  <Select
    value={node.join}
    onChange={e => tree.mutate(node.path, { join: e.target.value })}
    options={getJoinOptions(joinOptions)}
    placeholder={false}
  />
)

export default _.flow(observer, withTheme)(TagsJoinPicker)
