import * as F from 'futil-js'
import _ from 'lodash/fp'

export let promisedProps = Promise.props || (async x => _.zipObject(_.keys(x), await Promise.all(_.values(x))))

export let mapAsync = _.curry((f, d) => Promise.all(F.mapIndexed(f, d)))
export let mapValuesAsync = _.curry((f, d) => promisedProps(_.mapValues(f, d)))

// Doesn't pass along arity :(
// Tweaked from futil asyncFlow version to support multiple args to first function
export let flowAsyncF = (...fns) => (...x) =>
  fns.slice(1).reduce((v, f) => v.then(f), Promise.resolve(fns[0](...x)))
export let flowAsync = (...args) => {
  if (args.length === 1)
    return _.flow(flowAsyncF, _.curryN(args[0]))
  return flowAsyncF(...args)
}

