import _ from 'lodash/fp'
import * as F from 'futil-js'

export let transformTreePostOrder = (next = F.traverse) =>
  _.curry((f, x) => {
    let result = _.cloneDeep(x)
    F.walk(next)(_.noop, f)(result)
    return result
  })

export let maybeUpdateOn = _.curry((key, fn, data) => {
  if (_.get(key, data)) F.updateOn(key, fn, data)
})
