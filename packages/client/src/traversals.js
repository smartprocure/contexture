import { Tree } from './util/tree'

export let markForUpdate = Tree.walk(x => {
  if (x.paused) x.missedUpdate = true
  else x.markedForUpdate = true
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
