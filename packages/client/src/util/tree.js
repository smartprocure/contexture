import _ from 'lodash/fp'
import * as F from 'futil-js'

export let Tree = F.tree(
  _.get('children'),
  F.when(_.isString, key => ({ key }))
)

export let { encode } = F.encoder('/')

export let flattenTree = Tree.flatten(F.propTreePath('key'))
export let flatLeaves = Tree.flatLeaves

export let bubbleUp = (f, path) => _.flow(F.prefixes, _.reverse, _.map(f))(path)
