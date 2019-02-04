import _ from 'lodash/fp'
import * as F from 'futil-js'

// For futil
export let stampKey = _.curry((key, x) =>
  F.mapValuesIndexed((val, k) => ({ ...val, [key]: k }), x)
)

let validateValues = ({ value, values = [] }) => value || values.length

let twoLevelMatch = {
  validate: context =>
    !!(context.key_field && context.value_field && context.key_value),
  reactors: {
    value: 'others',
    key_value: 'self',
  },
  defaults: {
    key_field: '',
    value_field: '',
    key_value: '',
  },
}

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
      field: null,
      values: [],
      mode: 'include',
      optionsFilter: '',
      context: {
        options: [],
        cardinality: null,
      },
    },
    subquery: {
      useValues: x => ({ values: x }),
      getValues: x => _.map('name', x.context.options),
    },
  },
  text: {
    validate: validateValues,
    reactors: {
      value: 'others',
      operator: 'others',
    },
    defaults: {
      field: null,
      value: '',
      operator: 'containsWord',
    },
  },
  tagsText: {
    validate: validateValues,
    reactors: {
      values: 'others',
      join: 'others',
      operator: 'others',
    },
    defaults: {
      field: null,
      values: [],
      join: 'any',
      operator: 'containsWord',
    },
  },
  query: {
    validate: x => x.query,
    reactors: {
      query: 'others',
    },
    defaults: {
      field: null,
      query: '',
    },
  },
  tagsQuery: {
    validate: x => x.tags.length,
    reactors: {
      join: 'others',
      tags: 'others',
      exact: 'others',
    },
    defaults: {
      field: null,
      tags: [],
      join: 'any',
      exact: false,
    },
  },
  mongoId: {
    validate: validateValues,
    reactors: {
      values: 'others',
    },
    subquery: {
      useValues: x => ({ values: x }),
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
      page: 1,
      pageSize: 10,
      context: {
        response: {
          results: [],
          totalRecords: null,
        },
      },
    },
    onUpdateByOthers(node, extend) {
      extend(node, { page: 1 })
    },
  },
  number: {
    validate: x => !_.isNil(x.min) || !_.isNil(x.max),
    reactors: {
      min: 'others',
      max: 'others',
      findBestRange: 'self',
    },
    defaults: {
      field: null,
      min: null,
      max: null,
    },
  },
  bool: {
    reactors: {
      value: 'others',
    },
    defaults: {
      field: null,
      value: null,
    },
  },
  exists: {
    reactors: {
      value: 'others',
    },
    defaults: {
      field: null,
      value: null,
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
    defaults: {
      field: null,
      from: null,
      to: null,
    },
  },
  geo: {
    validate: x =>
      !!((x.location || (x.latitude && x.longitude)) && x.radius && x.operator),
    reactors: {
      location: 'others',
      latitude: 'others',
      longitude: 'others',
      radius: 'others',
      operator: 'others',
    },
    defaults: {
      operator: 'within',
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
  terms_stats: {
    reactors: {
      filter: 'self',
      key_field: 'self',
      value_field: 'self',
      order: 'self',
      sortDir: 'self',
      size: 'self',
    },
    defaults: {
      context: {
        terms: [],
        filter: '',
      },
    },
    subquery: {
      getValues: x => _.map('key', x.context.terms),
    },
  },
  cardinality: {
    reactors: {
      value: 'others',
    },
    defaults: {
      field: null,
    },
  },
  esTwoLevelAggregation: {
    validate: context =>
      context.key_field &&
      context.key_type &&
      context.value_field &&
      context.value_type,
    reactors: {
      value: 'others',
    },
    defaults: {
      key_field: '',
      key_type: '',
      key_data: null,
      value_field: '',
      value_type: '',
      value_data: null,
    },
  },
  groupedMetric: {
    validate: context =>
      context.metric.type &&
      !!(
        /value_count|top_hits/.test(context.metric.type) || context.metric.field
      ),
    reactors: {
      value: 'others',
    },
    defaults: {
      metric: {
        type: 'top_hits',
      },
    },
  },
  twoLevelMatch,
  matchCardinality: twoLevelMatch,
  matchStats: twoLevelMatch,
  nLevelAggregation: {
    reactors: {
      value: 'others',
    },
    defaults: {
      aggs: [],
      reducers: [],
      page: 0,
      pageSize: 0,
    },
  },
  nonzeroClusters: {
    validate: context => context.field,
    reactors: {
      value: 'others',
    },
    defaults: {
      field: '',
    },
  },
  numberRangeHistogram: {
    validate: context => !_.isNil(context.min) || !_.isNil(context.max),
    reactors: {
      value: 'others',
    },
    defaults: {
      field: '',
      min: 0,
      max: 0,
    },
  },
  percentileRanks: {
    validate: context => context.field && context.config.values,
    reactors: {
      value: 'others',
    },
    defaults: {
      field: '',
      values: [],
    },
  },
  percentiles: {
    validate: context => context.field,
    reactors: {
      value: 'others',
    },
    defaults: {
      field: '',
    },
  },
  percentilesRange: {
    validate: context => context.field,
    reactors: {
      value: 'others',
    },
    defaults: {
      field: '',
    },
  },
  smartIntervalHistogram: {
    validate: context => context.field,
    reactors: {
      value: 'others',
    },
    defaults: {
      field: '',
    },
  },
  smartPercentileRanks: {
    validate: context => context.field && context.values,
    reactors: {
      value: 'others',
    },
    defaults: {
      field: '',
      values: '',
    },
  },
  statistical: {
    reactors: {
      value: 'others',
    },
  },
  terms: {
    reactors: {
      value: 'others',
    },
  },
  termsDelta: {
    reactors: {
      value: 'others',
    },
  },
  termsStatsHits: {
    validate: context => context.key_field && context.value_field,
    reactors: {
      value: 'others',
    },
    defaults: {
      key_field: '',
      value_field: '',
    },
  },
  subquery: {
    validate: node =>
      node.localField && node.foreignField && (node.search || node.searchId),
    reactors: {
      localField: 'others',
      foreignField: 'others',
      search: 'others',
      searchId: 'others',
    },
  },
  savedSearch: {
    validate: node => node.search || node.searchId,
    reactors: {
      search: 'others',
      searchId: 'others',
    },
  },
})
