import _ from 'lodash/fp'
import * as F from 'futil-js'

export let unsetOn = _.curryN(2, _.unset.convert({immutable: false}))

export let invokes = _.curry((name, fn) => g => (...a) => g(...a)[name](fn))
export let catches = invokes('catch')

// Doesn't pass along arity :(
// Tweaked from futil asyncFlow version to support multiple args to first function
export let flowAsyncF = (...fns) => (...x) =>
  fns.slice(1).reduce((v, f) => v.then(f), Promise.resolve(fns[0](...x)))
export let flowAsync = (...args) => {
  if (args.length === 1)
    return _.flow(flowAsyncF, _.curryN(args[0]))
  return flowAsyncF(...args)
}

// not used, was for finding root in flat
let shortestKey = _.flow(
  _.keys,
  _.sortBy('length'),
  _.first
)