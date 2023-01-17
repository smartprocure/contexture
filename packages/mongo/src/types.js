import F from 'futil'
import exampleTypes from './example-types/index.js'

export default (config = {}) =>
  F.mapValuesIndexed((x, type) => F.callOrReturn(x, config[type]), exampleTypes)
