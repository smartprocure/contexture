import _ from 'lodash/fp'
import F from 'futil-js'
import { Tree } from './util/tree'
import { internalStateKeys } from './node'
import { runTypeFunctionOrDefault } from './types'

let isFilterOnly = x => !x.children && (x.forceFilterOnly || !x.markedForUpdate)

let getNilKeys = _.flow(_.pickBy(_.isNil), _.keys)

export default (tree, types, { search } = {}) => {
  let onSerialize = node =>
    runTypeFunctionOrDefault(_.identity, types, 'onSerialize', node, {})

  let internalKeys = _.without(search && ['lastUpdateTime'], internalStateKeys)

  let setFilterOnly = F.when(
    node => search && isFilterOnly(node),
    _.set('filterOnly', true)
  )

  return Tree.map(
    _.flow(
      setFilterOnly,
      x => _.omit([...internalKeys, ...getNilKeys(x)], x),
      onSerialize
    ),
    tree
  )
}
