import { defaultHasValue } from './validation'
// import {toSentence} from 'underscore.string.fp'

export default {
  default: {
    validate: defaultHasValue,
  },
  facet: {
    reactors: {
      values: 'others',
      mode: 'others',
      size: 'self',
      optionsFilter: 'self',
    },
  },
  text: {
    reactors: {
      value: 'others',
    },
  },
  query: {
    reactors: {
      query: 'others',
    },
  },
  mongoId: {
    reactors: {
      values: 'others',
    },
  },
  results: {
    reactors: {
      page: 'self',
    },
  },
  number: {
    reactors: {
      min: 'others',
      max: 'others',
    },
  },
}
