import _ from 'lodash/fp'
import * as F from 'futil-js'

let checkValueOn = (...fields) => _.flow(F.cascade(fields), _.negate(_.isEmpty))
let validate = checkValueOn('data.values', 'values', 'value')

export default {
  default: {
    validate: x => true,
  },
  facet: {
    validate,
    reactors: {
      values: 'others',
      mode: 'others',
      size: 'self',
      optionsFilter: 'self',
    },
  },
  text: {
    validate,
    reactors: {
      value: 'others',
    },
  },
  query: {
    validate: checkValueOn('data.query', 'query'),
    reactors: {
      query: 'others',
    },
  },
  mongoId: {
    validate,
    reactors: {
      values: 'others',
    },
  },
  results: {
    validate: x => false,
    reactors: {
      page: 'self',
    },
  },
  number: {
    validate: checkValueOn('min', 'max'),
    reactors: {
      min: 'others',
      max: 'others',
    },
  },
}
