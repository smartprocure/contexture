import _ from 'lodash/fp'

let validateValues = ({ value, values = [] }) => value || values.length

export default {
  facet: {
    validate: validateValues,
    reactors: {
      values: 'others',
      mode: 'others',
      size: 'self',
      optionsFilter: 'self',
    },
  },
  text: {
    validate: validateValues,
    reactors: {
      value: 'others',
    },
  },
  query: {
    validate: x => x.query,
    reactors: {
      query: 'others',
    },
  },
  mongoId: {
    validate: validateValues,
    reactors: {
      values: 'others',
    },
  },
  results: {
    validate: () => false,
    reactors: {
      page: 'self',
    },
  },
  number: {
    validate: x => !_.isNil(x.min) || !_.isNil(x.max),
    reactors: {
      min: 'others',
      max: 'others',
    },
  },
}
