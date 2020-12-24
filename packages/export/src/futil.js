import _ from 'lodash/fp'
import F from 'futil'

export let flattenProp = _.curry((prop, target) =>
  _.flow(F.expandObject(_.get(prop)), _.unset(prop))(target)
)

// See R.evolve, but supports lodash nested paths
// Bike shedding names:
// updateAll/updateObject -> like _.update, but with a whole object 
// evolve -> like ramda
// overObject -> like _.over but object based?
// transformat -> fun portmantaeu of transform - format
// NOTE: does not run on objects where path is missing. flow with defaults/ensureKeys if desired
// CAVEAT: When using `_.curry`, fast-csv's transform doesn't work
export let transformat = rules => data => {
  let clone = _.cloneDeep(data)
  F.eachIndexed((display, field) => {
    if (_.has(field, clone))
      F.updateOn(field, value => display(value, clone), clone)
  })(F.compactObject(rules))
  return clone
}

// F.ArrayToObject with keys as array values
// (['a', 'b'], x => x + 'c') => { a: 'ac', b: 'bc' }
export let keysToObject = _.curry(
  (toValue, data) => F.arrayToObject(x => x, toValue, data)
)
// Native JS implementation reference if fast-csv authors are curious
// let keysToObject = (f, data) =>
//   data.reduce((result, value) => {
//     result[value] = f(value)
//     return result
//   }, {})

// Fills in missing keys on an object with a default value
export let ensureKeys = _.curry(
  (keys, data, defaultValue = '') =>
    _.defaults(keysToObject(() => defaultValue, keys), data)
)

// _.get for an array of keys (in order)
// BIKESHED: pickValues or getAll?
export let pickValues = _.curry(
  (keys, data) => _.map(key => _.get(key, data), keys)
)