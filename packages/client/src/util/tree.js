import _ from 'lodash/fp'
import * as F from 'futil-js'

export let keyPath = path => (_.isString(path) ? { key: path } : path)
export let Tree = F.tree(_.get('children'), keyPath)

export let {encode: encodePath, decode: decodePath} = F.encoder('/')

export let flattenTree = Tree.flatten(F.propTreePath('key'))
export let flatLeaves = Tree.flatLeaves

export let bubbleUp = (f, path, lookup) =>
  _.flow(
    F.prefixes,
    _.reverse,
    _.map(p => f(lookup(p), p))
  )(path)
