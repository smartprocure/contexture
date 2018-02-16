import _ from 'lodash/fp'
import { unsetOn } from 'futil-js'
import { Tree } from './util/tree'

let isFilterOnly = x => !x.children && (x.forceFilterOnly || !x.markedForUpdate)
let getNillKeys = _.flow(
  _.toPairs,
  _.map(([k, v]) => _.isNil(v) ? k : v),
  _.compact
)

export default (tree, { search } = {}) =>
  _.flow(
    _.tap(
      Tree.walk(
        x => {
          if (search && isFilterOnly(x)) {
            x.filterOnly = true
            if (!x.hasValue) x.markedForDeletion = true
          }
          _.each(unsetOn(_, x), [
            'markedForUpdate',
            'path',
            'updating',
            'paused',
            'missedUpdate',
            'hasValue',
            'context',
            'error',
            'results',
            ...(search ? [] : ['lastUpdateTime']),
            ...getNillKeys(x)
          ])
        },
        x => {
          if (x.children) {
            x.children = _.flow(
              _.reject('markedForDeletion'),
              _.reject(x => x.children && !x.children.length)
            )(x.children)
          }
        }
      )
    ),
    // if it has no children, all were deleted
    x => x.children && x
  )(tree)
