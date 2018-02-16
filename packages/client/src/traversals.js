import { Tree } from './util/tree'

export let markForUpdate = extend =>
  Tree.walk(x => {
    if (x.paused) extend(x, { missedUpdate: true })
    else extend(x, { markedForUpdate: true })
  })
export let markLastUpdate = extend => time =>
  Tree.walk(child => {
    if (child.markedForUpdate) extend(child, { lastUpdateTime: time })
  })
export let prepForUpdate = extend =>
  Tree.walk(child => {
    if (child.markedForUpdate) {
      extend(child, {
        updating: true,
        markedForUpdate: false,
      })
    }
  })
