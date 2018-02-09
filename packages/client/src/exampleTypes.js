import { defaultHasValue } from './validation'
// import {toSentence} from 'underscore.string.fp'

export default {
  default: {
    validate: defaultHasValue,
  },
  facet: {
    // data: {
    //   values: [],
    //   mode: 'include',
    // },
    // config: {
    //   size: 12,
    //   filter: '',
    // },
    // context: {
    //   total: 0,
    //   options: [],
    //   cardinality: 0,
    // },
    reactors: {
      values: 'others',
      mode: 'others',
      size: 'self',
      filter: 'self',
    },
    // validate: x => x.data.values,
    // toString: ({data: {values, mode}}) =>
    //   values.length
    //     ? F.compactJoin(' ', [
    //       'is',
    //       mode === 'exclude' ? 'not' : '',
    //       toSentence(', ', ` ${mode === 'exclude' ? 'nor' : 'or'} `, values)
    //     ])
    //     : 'is anything'
  },
  text: {
    reactors: {
      value: 'others',
    },
  },
  facet: {
    reactors: {
      values: 'others',
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
  group: {
    reactors: {
      children: 'others',
    },
  },
  results: {
    reactors: {
      page: 'self',
    },
  },
}
