import _ from 'lodash/fp'
import F from 'futil'

export let transformTreePostOrder = (next = F.traverse) =>
  _.curry((f, x) => {
    let result = _.cloneDeep(x)
    F.walk(next)(_.noop, f)(result)
    return result
  })

export let maybeUpdateOn = _.curry((fn, key, data) =>
  _.get(key, data) ? F.updateOn(key, fn, data) : data
)

// Recursively transforming multiple props with supplying produced transformation
export let deepMultiTransformOn = (props, transformWith) => {
  let self = _.flow(
    _.map(maybeUpdateOn(transformWith(x => self(x)))),
    _.flow,
  )(props)
  return self
}