import _ from 'lodash/fp'
import * as F from 'futil-js'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'

// Utils
export let hover = set => ({
  onMouseOver: () => F.set(true, set),
  onMouseOut: () => F.set(false, set),
})
// export let Component = (init, render) => inject(init)(observer(render))
// export let Component = (init, render) => inject(render ? init : () => {})(observer(render || init))
export let Component = (init, render, displayName) => {
  let c = observer(render || init)
  if (displayName) {
    c.displayName = displayName
    console.log(displayName)
  }
  return inject(render ? init : () => {})(c)
}

// standard futil lens wasn't working in inject with mapValues
export let lensOf = s =>
  _.reduce(
    (res, key) => {
      res[key] = F.lensProp(key, s)
      return res
    },
    {},
    _.keys(s)
  )
export let lenservable = x => {
  let s = observable(x)
  s.lens = lensOf(s)
  return s
}
// let toggle = (val, lens, unset=undefined) => {
//   F.set(F.view(lens) === val ? unset : val, lens)
// }

export let withStateLens = state => inject(() => F.lensOf(observable(state)))

export let partial = _.curry((x, y) => inject(() => x)(y))
