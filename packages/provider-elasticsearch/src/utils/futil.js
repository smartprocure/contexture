let _ = require('lodash/fp')
let F = require('futil')

let maybeAppend = (suffix, str) =>
  _.endsWith(suffix, str) ? str : str + suffix

let keysToObject = F.arrayToObject(x => x) // futil candidate from exports
let keysToEmptyObjects = keysToObject(() => ({}))

let pickNumbers = _.pickBy(_.isNumber)
// toNumber but without casting null and '' to 0
let safeNumber = value => !F.isBlank(value) && _.toNumber(value)
let pickSafeNumbers = _.flow(_.mapValues(safeNumber), pickNumbers)

let writeTreeNode = (next = F.traverse) => (
  node,
  index,
  [parent, ...parents],
  [parentIndex, ...indexes]
) => (next(parent, parentIndex, parents, indexes)[index] = node)

// POST ORDER MAP
//  Post order traversal is important if you're replacing the tree structure
//  If you replace/modify the parent before you do the children, things get weird and don't work
//  You can work around this with pre-order by mutating in place and returning the original node for the map, but that defeats the purpose of map over traversal + mutation
let transformTreePostOrder = (next = F.traverse) =>
  _.curry((f, x) => {
    let result = _.cloneDeep(x)
    F.walk(next)(_.noop, f)(result)
    return result
  })
// same as map tree, just transforms post order instead of pre order
let mapTreePostOrder = (next = F.traverse, writeNode = writeTreeNode(next)) =>
  _.curry(
    (mapper, tree) =>
      transformTreePostOrder(next)((node, i, parents, ...args) => {
        if (parents.length)
          writeNode(mapper(node, i, parents, ...args), i, parents, ...args)
      })(mapper(tree)) // run mapper on root, and skip root in traversal
  )
// Convert tree from one structure to another
let transmuteTree = (
  traverseSource,
  traverseTarget,
  cleanupSourceTraversalPaths = _.noop
) =>
  mapTreePostOrder(
    traverseSource,
    writeTreeNode((...args) => {
      cleanupSourceTraversalPaths(...args)
      return traverseTarget(...args)
    })
  )

let logJSON = result => console.info(JSON.stringify(result, null, 2))

// Returns a proxy array that represents a virtual concatenation of two arrays
// Reading/writing this virtual array reads/writes the underlying arrays (and doesn't clone)
// Should be very memory/CPU efficient when you'd otherwise concat arrays just for traversal
let virtualConcat = (a1 = [], a2 = []) =>
  new Proxy([], {
    get(obj, key) {
      let size = a1.length
      if (key == 'length') return size + a2.length
      if (key == Symbol.toStringTag) return `${a1.toString()},${a2.toString()}`
      // i is a string, so cast and check it's a number
      if (_.isFinite(Number(key))) return key < size ? a1[key] : a2[key - size]
    },
    set(obj, key, value) {
      let size = a1.length
      if (key < size) a1[key] = value
      else a2[key - size] = value
    },
  })

module.exports = {
  maybeAppend,
  keysToObject,
  keysToEmptyObjects,
  safeNumber,
  pickNumbers,
  pickSafeNumbers,
  writeTreeNode,
  mapTreePostOrder,
  transmuteTree,
  logJSON,
  virtualConcat,
}
