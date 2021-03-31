import * as F from 'futil-js'

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
    return x
  },
  markLastUpdate: time =>
    child => {
      if (child.markedForUpdate) extend(child, { lastUpdateTime: time })
    },
  prepForUpdate: child => {
    if (child.markedForUpdate) {
      extend(child, {
        updating: true,
        markedForUpdate: false,
      })
    }
  },
})
