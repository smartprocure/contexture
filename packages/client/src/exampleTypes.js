import _ from 'lodash/fp'
import * as F from 'futil-js'

// For futil
export let stampKey = _.curry((key, x) =>
  F.mapValuesIndexed((val, k) => ({ ...val, [key]: k }), x)
)

let validateValues = ({ value, values = [] }) => value || values.length

export default stampKey('type', {
  facet: {
    validate: validateValues,
    reactors: {
      values: 'others',
      mode: 'others',
      size: 'self',
      optionsFilter: 'self',
      sort: 'self',
    },
    defaults: {
      values: [],
      // mode: 'include',
      optionsFilter: '',
      context: {
        options: [],
        cardinality: null,
      },
    },
  },
  text: {
    validate: validateValues,
    reactors: {
      value: 'others',
    },
    defaults: {
      value: ''
    }
  },
  query: {
    validate: x => x.query,
    reactors: {
      query: 'others',
    },
    defaults: {
      query: ''
    }
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
      pageSize: 'self',
      sortField: 'self',
      sortDir: 'self',
      include: 'self',
    },
    defaults: {
      // page: 1,
      pageSize: 10,
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
    defaults: {
      min: null,
      max: null
    }
  },
  bool: {
    reactors: {
      value: 'others',
    },
    defaults: {
      value: null
    }
  },
  exists: {
    reactors: {
      value: 'others',
    },
    defaults: {
      value: null
    }
  },
  date: {
    validate: x => !_.isNil(x.from) || !_.isNil(x.to),
    reactors: {
      from: 'others',
      to: 'others',
      useDateMath: 'others',
      useRaw: 'others',
    },
    defaults: {
      from: null,
      to: null
    }
  },
  geo: {
    reactors: {
      location: 'others',
      radius: 'others',
      operator: 'others',
    },
  },
  dateHistogram: {
    reactors: {
      key_field: 'self',
      value_field: 'self',
      interval: 'self',
    },
    defaults: {
      context: {
        entries: [],
        maxDate: null,
        minDate: null,
      },
    },
  },
})
