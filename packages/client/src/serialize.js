import _ from 'lodash/fp'
import { unsetOn } from 'futil-js'
import { Tree } from './util/tree'
import { internalStateKeys } from './node'

let isFilterOnly = x => !x.children && (x.forceFilterOnly || !x.markedForUpdate)
let getNilKeys = _.flow(_.pickBy(_.isNil), _.keys)

export default (tree, { search } = {}) =>
  _.flow(
    _.tap(
      Tree.walk(
        x => {
          if (search && isFilterOnly(x)) {
            x.filterOnly = true
          }
          _.each(unsetOn(_, x), [
            ..._.keys(
              _.omit(search ? 'lastUpdateTime' : '', internalStateKeys)
            ),
            ...getNilKeys(x),
          ])
        },
        x => {
          if (x.children) {
            x.children = _.reject(
              x => x.children && !x.children.length,
              x.children
            )
          }
        }
      )
    ),
    // if it has no children, all were deleted
    x => x.children && x
  )(tree)
