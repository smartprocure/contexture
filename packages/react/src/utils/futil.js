import _ from 'lodash/fp'
import * as F from 'futil'

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

let canMerge = a => !_.isEmpty(a) && a

export let mergeOrReturn = _.curry(
  (a, b) =>
    (canMerge(a) && canMerge(b) && _.merge(a, b)) ||
    canMerge(a) ||
    canMerge(b) ||
    {}
)

// (x -> y) -> k -> {k: x} -> y
export let getWith = _.curry((customizer, path, object) =>
  customizer(_.get(path, object))
)

// ({a} -> {b}) -> {a} -> {a, b}
export let expandObject = _.curry((transform, obj) => ({
  ...obj,
  ...transform(obj),
}))

// k -> (a -> {b}) -> {k: a} -> {a, b}
export let expandObjectBy = _.curry((key, fn, obj) =>
  expandObject(getWith(fn, key))(obj)
)
