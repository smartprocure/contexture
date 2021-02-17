let _ = require('lodash/fp')
let F = require('futil')

let maybeAppend = (suffix, str) =>
  _.endsWith(suffix, str) ? str : str + suffix

let keysToObject = F.arrayToObject(x => x) // futil candidate from exports
let keysToEmptyObjects = keysToObject(() => ({}))

let pickNumbers = _.pickBy(_.isNumber)
// toNumber but without casting null and '' to 0
let safeNumber = value => !F.isBlank(value) && _.toNumber(value)
let pickSafeNumbers = _.flow(_.mapValues(safeNumber), pickNumbers)

module.exports = {
  maybeAppend,
  keysToObject,
  keysToEmptyObjects,
  safeNumber,
  pickNumbers,
  pickSafeNumbers,
}
