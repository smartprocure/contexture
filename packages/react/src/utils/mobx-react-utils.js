import _ from 'lodash/fp'
import * as F from 'futil-js'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'

// Utils
export let hover = set => ({
  onMouseOver: () => F.set(true, set),
  onMouseOut: () => F.set(false, set),
})
export let focus = set => ({
  onFocus: () => F.set(true, set),
  onBlur: () => F.set(false, set),
})

// export let Component = (init, render) => inject(init)(observer(render))
// export let Component = (init, render) => inject(render ? init : () => {})(observer(render || init))
export let Component = (init, render, displayName) => {
  let c = observer(render || init)
  if (displayName) {
    c.displayName = displayName
  }
  return inject(render ? init : () => {})(c)
}

export let lenservable = x => {
  let s = observable(x)
  s.lens = F.lensOf(s)
  return s
}

export let withStateLens = state => inject(() => F.lensOf(observable(state)))

export let partial = _.curry((x, y) => inject(() => x)(y))

export let injectDefaults = f =>
  inject((stores, props) => f(_.defaults(stores, props)))
