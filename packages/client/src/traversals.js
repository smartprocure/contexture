import F from 'futil'
import { Tree } from './util/tree'

export default extend => {
  let markForUpdate = x => {
    if (x.paused) extend(x, { missedUpdate: true })
    else if (!x.markedForUpdate) {
      let updatingDeferred = F.defer()
      extend(x, {
        markedForUpdate: true,
        updatingPromise: updatingDeferred.promise,
        updatingDeferred,
        isStale: true,
      })
    }
    return x
  }
  return {
    markForUpdate,
    clearUpdate: node => extend(node, { updating: false, isStale: false }),
    markLastUpdate: time =>
      Tree.walk(node => {
        if (node.markedForUpdate) extend(node, { lastUpdateTime: time })
      }),
    prepForUpdate: Tree.walk(node => {
      if (node.markedForUpdate) {
        extend(node, {
          updating: true,
          markedForUpdate: false,
        })
      }
    }),
  }
}
