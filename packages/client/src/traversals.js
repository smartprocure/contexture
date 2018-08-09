import _ from 'lodash/fp'
import * as F from 'futil-js'
import { Tree } from './util/tree'

export default extend => ({
  // When a group node has the join "not" and is changed to something else,
  // it triggers the reactor for "join", which then
  // triggers the reactor of "all", which returns the children,
  // which makes it so the array of children is sent to markForUpdate,
  // which crashes since we can't call MobX's set() on an array.
  //
  // Our current solution is to ensure that we are working over an array
  // (by checking if the input object is an array and wrapping it in an array if it's not),
  // then we iterate the array with the markForUpdate traversal.
  markForUpdate: _.flow(
    x => (x.length ? x : [x]), // _.castArray doesn't work with MobX arrays
    _.map(x => {
      if (x.paused) extend(x, { missedUpdate: true })
      else if (!x.markedForUpdate) {
        let updatingDeferred = F.defer()
        extend(x, {
          markedForUpdate: true,
          updatingPromise: updatingDeferred.promise,
          updatingDeferred,
        })
      }
      return x
    })
  ),
  markLastUpdate: time =>
    Tree.walk(child => {
      if (child.markedForUpdate) extend(child, { lastUpdateTime: time })
    }),
  prepForUpdate: Tree.walk(child => {
    if (child.markedForUpdate) {
      extend(child, {
        updating: true,
        markedForUpdate: false,
      })
    }
  }),
})
