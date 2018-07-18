import _ from 'lodash/fp'
import * as F from 'futil-js'

// For futil?

// Logic
export let onlyWhen = f => F.unless(f, () => {})

// Tree
export let FlattenTreeLeaves = Tree => _.flow(Tree.flatten(), _.omitBy(Tree.traverse))
export let PlainObjectTree = F.tree(onlyWhen(_.isPlainObject))
export let flattenPlainObject = F.whenExists(FlattenTreeLeaves(PlainObjectTree))

// Arrays
export let pushAt = _.curry((index, val, arr) => {
  let result = _.clone(arr)
  result.splice(index, 0, val)
  return result
})
export let moveIndex = (from, to, arr) =>
  _.flow(_.pullAt(from), pushAt(to, arr[from]))(arr)
