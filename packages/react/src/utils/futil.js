import _ from 'lodash/fp.js'
import F from 'futil'

// Logic
export let onlyWhen = (f) => F.unless(f, () => {})

// Tree
export let FlattenTreeLeaves = (Tree) =>
  _.flow(Tree.flatten(), _.omitBy(Tree.traverse))
export let PlainObjectTree = F.tree(onlyWhen(_.isPlainObject))
export let flattenPlainObject = F.whenExists(FlattenTreeLeaves(PlainObjectTree))

let canMerge = (a) => !_.isEmpty(a) && a

export let mergeOrReturn = _.curry(
  (a, b) =>
    (canMerge(a) && canMerge(b) && _.merge(a, b)) ||
    canMerge(a) ||
    canMerge(b) ||
    {}
)

export let aspectWrapper = F.aspect({
  after: (result) => console.info('"after" aspect fired!', result),
  onError: (e) => console.error('"onError" aspect fired!', e),
})

export const flattenObjectWith = _.curryN(2, (fn, input, paths) =>
  F.isFlatObject(input)
    ? input
    : F.reduceIndexed(
        (output, value, key) =>
          _.merge(output, fn(value, F.dotJoinWith(F.isNotNil)([paths, key]))),
        {},
        input
      )
)

// { a: [{ b: { c: 1 } }] } => { a: [{ 'b.c': 1 }] }
export const flattenObjectsNotArrays = flattenObjectWith((value, path) => {
  if (_.isPlainObject(value)) return flattenObjectsNotArrays(value, path)
  if (_.isArray(value)) return { [path]: _.map(flattenObjectsNotArrays, value) }
  return { [path]: value }
})
