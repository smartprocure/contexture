import _ from 'lodash/fp'
import * as F from 'futil-js'

export let keyPath = path => (_.isString(path) ? { key: path } : path)
export let Tree = F.tree(_.get('children'), keyPath)

export let lookup = (tree, path) => _.find(keyPath(path), Tree.traverse(tree))
// export let lookup = (tree, path) => Tree.lookup(path, tree)

export let {encode: encodePath, decode: decodePath} = F.encoder('/')

export let flattenTree = Tree.flatten(F.propTreePath('key'))
export let flatLeaves = Tree.flatLeaves

export let bubbleUp = (f, path, lookup) =>
  _.flow(
    F.prefixes,
    _.reverse,
    _.map(p => f(lookup(p), p))
  )(path)
