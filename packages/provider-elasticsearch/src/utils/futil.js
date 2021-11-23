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

let writeTreeNode = (next = traverse) => (
  node,
  index,
  [parent, ...parents],
  [parentIndex, ...indexes]
) => (next(parent, parentIndex, parents, indexes)[index] = node)

// POST ORDER MAP
//  Post order traversal is important if you're replacing the tree structure
//  If you replace/modify the parent before you do the children, things get weird and don't work
//  You can work around this with pre-order by mutating in place and returning the original node for the map, but that defeats the purpose of map over traversal + mutation
let transformTreePostOrder = (next = traverse) =>
  _.curry((f, x) => {
    let result = _.cloneDeep(x)
    F.walk(next)(_.noop, f)(result)
    return result
  })
// same as map tree, just transforms post order instead of pre order
let mapTreePostOrder = (next = traverse, writeNode = writeTreeNode(next)) =>
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

let logJSON = result => console.log(JSON.stringify(result, null, 2))

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
}
