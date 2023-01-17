import F from 'futil'
import * as exampleTypes from './example-types/index.js'

const unwrapDefault = x => x.default || x

export default (config = {}) =>
  F.mapValuesIndexed(
    (x, type) => F.callOrReturn(unwrapDefault(x), config[type]),
    exampleTypes
  )
