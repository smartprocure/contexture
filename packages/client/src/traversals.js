import F from 'futil'
import _ from 'lodash/fp.js'
import { Tree } from './util/tree.js'

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
    syncMarkedForUpdate(tree) {
      // This method is to sync markedForUpdate/isStale
      //  in theory this could be a getter/setter or writeableComputed
      //  syncing manually avoids taking on a dependency like mobx in the core

      // This walk/push will be replaced in the future by Tree.toArrayBy({ post: /* ... */})
      let updatedNodes = []
      Tree.walk(
        () => {},
        node => {
          if (_.some('markedForUpdate', node.children))
            updatedNodes.push(markForUpdate(node))
          else if (node.children)
            extend(node, {
              markedForUpdate: false,
              ...(node.updating || { isStale: false }),
            })
        }
      )(tree)
      return updatedNodes
    },
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
