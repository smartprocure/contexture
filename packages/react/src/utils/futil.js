import _ from 'lodash/fp'
import * as F from 'futil-js'

// Logic
export let onlyWhen = f => F.unless(f, () => {})

// Tree
export let FlattenTreeLeaves = Tree =>
  _.flow(
    Tree.flatten(),
    _.omitBy(Tree.traverse)
  )
export let PlainObjectTree = F.tree(onlyWhen(_.isPlainObject))
export let flattenPlainObject = F.whenExists(FlattenTreeLeaves(PlainObjectTree))

let canMerge = a => (!_.isEmpty(a) ? a : false)

export let mergeOrReturn = _.curry(
  (a, b) =>
    (canMerge(a) && canMerge(b) && _.merge(a, b)) ||
    canMerge(a) ||
    canMerge(b) ||
    {}
)
