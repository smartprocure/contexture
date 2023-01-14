import _ from 'lodash/fp.js'
import * as m from 'mobx'

// Observable without proxy for any version of mobx
export let observable = (x) => {
  try {
    return m.observable(x, {}, { proxy: false })
  } catch (e) {
    return m.observable(x)
  }
}

// https://github.com/mobxjs/mobx/issues/2912#issuecomment-825890901
export let toJS = (x) =>
  _.cloneDeepWith((value) => {
    if (m.isObservable(value)) return m.toJS(value)
  }, x)
