import _ from 'lodash/fp'
import * as F from 'futil-js'

export let Tree = F.tree(_.get('children'))
let path = F.encoder('->')

// Path Lookup
export let keyPath = path => (_.isString(path) ? { key: path } : path)
export let lookup = (tree, path) => _.find(keyPath(path), Tree.traverse(tree))

export let encodePath = path.encode
export let decodePath = path.decode

// Flat Tree Utils
let flatBuilder = F.treePath(_.flow(F.treeValues, _.map('key')), F.encoder('->'))
export let flattenTree = Tree.flatten(flatBuilder)

export let bubbleUp = (f, path, flatTree) => {
  if (_.isEmpty(path)) return
  f(flatTree[encodePath(path)], path)
  bubbleUp(f, _.dropRight(1, path), flatTree)
}
export let flatLeaves = Tree.flatLeaves
