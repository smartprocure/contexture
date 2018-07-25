import _ from 'lodash/fp'
import * as F from 'futil-js'

// For futil?

// Logic
export let onlyWhen = f => F.unless(f, () => {})

// Tree
export let FlattenTreeLeaves = Tree =>
  _.flow(Tree.flatten(), _.omitBy(Tree.traverse))
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

// Immutable
export let toggleElementBy = _.curry((check, val, arr) =>
  (F.callOrReturn(check, val, arr) ? _.pull : F.push)(val, arr)
)
export let toggleElement = toggleElementBy(_.includes)

// Lens
export let setsWith = _.curry((f, lens) => x => F.set(_.iteratee(f)(x), lens))
// No longer used
// export let lensSetsWith = _.curry(
//   (f, lens) => _.extend(lens, { set: setsWith(f, lens) })
// )

export let includeLens = (value, lens) => ({
  get: () => F.view(lens).includes(value),
  set: x => F.set(toggleElementBy(!x, value, F.view(lens)), lens),
})

// No longer used
// export let flipperLens = lens => _.extend(lens, { set: F.flip(lens) })
