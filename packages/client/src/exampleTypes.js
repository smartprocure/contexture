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
    defaults: {
      context: {
        values: [],
      },
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
    defaults: {
      context: {
        response: {
          results: [],
          totalRecords: null,
        },
      },
    },
  },
  number: {
    validate: x => !_.isNil(x.min) || !_.isNil(x.max),
    reactors: {
      min: 'others',
      max: 'others',
    },
  },
  bool: {
    reactors: {
      value: 'others',
    },
  },
  exists: {
    reactors: {
      value: 'others',
    },
  },
  date: {
    validate: x => !_.isNil(x.from) || !_.isNil(x.to),
    reactors: {
      from: 'others',
      to: 'others',
      useDateMath: 'others',
      useRaw: 'others',
    },
  },
  geo: {
    reactors: {
      location: 'others',
      radius: 'others',
      operator: 'others',
    },
  },
  dateHistogram: {
    defaults: {
      context: {
        entries: [],
        maxDate: null,
        minDate: null,
      },
    },
  },
}
