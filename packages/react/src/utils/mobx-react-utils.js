import _ from 'lodash/fp'
import * as F from 'futil-js'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'

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

export let injectDefaults = f =>
  inject((stores, props) => f(_.defaults(stores, props)))
