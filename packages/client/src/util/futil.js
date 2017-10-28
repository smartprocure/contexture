import _ from 'lodash/fp'
import * as F from 'futil-js'

export let unsetOn = _.curryN(2, _.unset.convert({immutable: false}))

export let invokes = _.curry((name, fn) => g => (...a) => g(...a)[name](fn))
export let catches = invokes('catch')

// not used, was for finding root in flat
let shortestKey = _.flow(
  _.keys,
  _.sortBy('length'),
  _.first
)