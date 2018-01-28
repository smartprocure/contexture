import _ from 'lodash/fp'
import * as F from 'futil-js'

export let Tree = F.tree(
  _.get('children'),
  F.when(_.isString, key => ({ key }))
)

export let { encode, decode } = F.encoder('/')

export let flattenTree = Tree.flatten(F.propTreePath('key'))
export let flatLeaves = Tree.flatLeaves

export let bubbleUp = (f, path, lookup) =>
  _.flow(F.prefixes, _.reverse, _.map(p => f(lookup(p), p, lookup)))(path)
