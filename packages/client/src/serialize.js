import _ from 'lodash/fp'
import { when } from 'futil-js'
import { Tree } from './util/tree'
import { internalStateKeys } from './node'

let isFilterOnly = x => !x.children && (x.forceFilterOnly || !x.markedForUpdate)
let getNilKeys = _.flow(_.pickBy(_.isNil), _.keys)

export default (tree, { search } = {}) =>
  Tree.map(({ onSerialize = _.identity, ...x }) => {
    let omitKeys = [
      ..._.without(search && ['lastUpdateTime'], internalStateKeys),
      ...getNilKeys(x),
    ]
    return _.flow(
      when(x => search && isFilterOnly(x), _.set('filterOnly', true)),
      _.omit(omitKeys),
      onSerialize
    )(x)
  }, tree)
