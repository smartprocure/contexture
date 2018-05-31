import _ from 'lodash/fp'
import * as F from 'futil-js'

export let Tree = F.tree(
  _.get('children'),
  F.when(_.isString, key => ({ key }))
)

export let flatten = Tree.flatten(F.propTreePath('key'))
export let { encode, decode } = F.slashEncoder

export let bubbleUp = (f, path) =>
  _.flow(
    F.prefixes,
    _.reverse,
    _.map(f)
  )(path)

let isNotEqual = _.negate(_.isEqual)
export let isParent = _.overEvery([isNotEqual, _.startsWith])
