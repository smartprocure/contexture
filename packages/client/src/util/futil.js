import _ from 'lodash/fp'

// export let invokes = _.curry((name, fn) => g => (...a) => g(...a)[name](fn))
// export let catches = invokes('catch')
export let pullOn = _.pull.convert({ immutable: false })

// let shortestKey = _.flow(
//   _.keys,
//   _.minBy('length')
// )
