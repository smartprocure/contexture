import * as F from 'futil-js'
import { Tree } from './util/tree'

export default extend => ({
  markForUpdate(x) {
    if (x.paused) extend(x, { missedUpdate: true })
    else if (!x.markedForUpdate) {
      let updatingDeferred = F.defer()
      extend(x, {
        markedForUpdate: true,
        updatingPromise: updatingDeferred.promise,
        updatingDeferred,
      })
    }
  },
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
