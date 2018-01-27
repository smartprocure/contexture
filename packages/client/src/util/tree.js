import _ from 'lodash/fp'
import * as F from 'futil-js'

export let Tree = F.tree(_.get('children'))

// Path Lookup
export let keyPath = path => (_.isString(path) ? { key: path } : path)
export let lookup = (tree, path) => _.find(keyPath(path), Tree.traverse(tree))

export let encodePath = F.compactJoin('->')
export let decodePath = _.split('->')

// Flat Tree Utils
export let setPath = (node, i, [{ path = '' } = {}] = []) => {
  return node.path = encodePath([path, _.get('key', node)])
}

let flatBuilder = F.treePath(_.flow(F.treeValues, _.map('key')), F.encoder('->'))
export let flattenTree = Tree.flatten(flatBuilder)

export let bubbleUp = (f, path, flatTree) => {
  if (_.isEmpty(path)) return
  f(flatTree[encodePath(path)], path)
  bubbleUp(f, _.dropRight(1, path), flatTree)
}
export let flatLeaves = Tree.flatLeaves
