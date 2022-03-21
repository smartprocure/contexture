import _ from 'lodash/fp'
import F from 'futil'

export let transformTreePostOrder = (next = F.traverse) =>
  _.curry((f, x) => {
    let result = _.cloneDeep(x)
    F.walk(next)(_.noop, f)(result)
    return result
  })

export let maybeUpdateOn = _.curry((key, fn, data) =>
  _.get(key, data) ? F.updateOn(key, fn, data) : data
)
