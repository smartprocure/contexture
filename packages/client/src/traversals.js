import {Tree} from './util/tree'

export let markForUpdate = Tree.walk(x => {
  x.markedForUpdate = true
})
export let markLastUpdate = time =>
  Tree.walk(child => {
    if (child.markedForUpdate) child.lastUpdateTime = time
  })
export let prepForUpdate = Tree.walk(child => {
  if (child.markedForUpdate) {
    child.updating = true
    child.markedForUpdate = false
  }
})
export let acknoweldgeMissedUpdates = Tree.walk(child => {
  if (child.paused) child.missedUpdates = true
})
