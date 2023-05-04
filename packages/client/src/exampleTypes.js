import _ from 'lodash/fp.js'
import F from 'futil'
import pivot from './exampleTypes/pivot.js'

let validateValues = ({ value, values = [] }) => value || values.length
let validateValueExistence = _.flow(_.get('value'), _.negate(_.isNil))

let twoLevelMatch = {
  validate: (context) =>
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

export default F.stampKey('type', {
  facet: {
    label: 'List',
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
      useValues: (x) => ({ values: x }),
      getValues: (x) => _.map('name', x.context.options),
    },
  },
  dateRangeFacet: {
    label: 'List',
    validate: validateValues,
    reactors: {
      values: 'others',
      ranges: 'others',
    },
    defaults: {
      field: null,
      values: [],
      context: {
        options: [],
      },
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
    label: 'Text',
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
    validate: (x) => x.query,
    reactors: {
      query: 'others',
    },
    defaults: {
      field: null,
      query: '',
    },
  },
  tagsQuery: {
    label: 'Matches',
    validate: _.get('tags.length'),
    reactors: {
      join: 'others',
      tags: 'all',
      exact: 'all',
      //Only react when generateKeywords is true
      generateKeywords: (parent, node, event) => event.value.generateKeywords ? 
        [node] : [],
    },
    defaults: {
      generateKeywords: false,
      field: null,
      tags: [],
      keywordGenerations: [],
      join: 'any',
      exact: false,
      context: {
        results: {},
      },
    },
    shouldMergeResponse: (node) => !node.generateKeywords,
    mergeResponse(node, response, extend) {
      // extend but alwayrs persist keywordGenerations when appropriate
      extend(node, {
        context: {
          keywordGenerations: node.context.keywordGenerations, 
          tags: response.context.tags
        },
      })
    }, 
  },
  mongoId: {
    validate: validateValues,
    reactors: {
      value: 'others',
      values: 'others',
    },
    subquery: {
      useValues: (x) => ({ values: x }),
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
      view: 'table',
      context: {
        results: [],
        totalRecords: null,
      },
    },
    onUpdateByOthers(node, extend) {
      extend(node, { page: 1 })
    },
    shouldMergeResponse: (node) => node.infiniteScroll,
    mergeResponse(node, response, extend) {
      // extend but merge results arrays
      extend(node, {
        context: {
          ...response.context,
          results: [...node.context.results, ...response.context.results],
        },
      })
    },
  },
  number: {
    validate: (x) => !_.isNil(x.min) || !_.isNil(x.max),
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
    validate: validateValueExistence,
    reactors: {
      value: 'others',
    },
    defaults: {
      field: null,
      value: null,
    },
  },
  exists: {
    validate: validateValueExistence,
    reactors: {
      value: 'others',
    },
    defaults: {
      field: null,
      value: null,
    },
  },
  date: {
    validate: ({ from, to, range }) =>
      range &&
      range !== 'allDates' &&
      ((range === 'exact' && (from || to)) || range !== 'exact'),
    reactors: {
      from: 'others',
      to: 'others',
      range: 'others',
    },
    defaults: {
      field: null,
      from: null,
      to: null,
      range: 'exact',
      timezone: null,
    },
  },
  geo: {
    validate: (x) =>
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
      location: '',
      radius: '',
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
      getValues: (x) => _.map('key', x.context.terms),
    },
    autoKey: (x) => F.compactJoin('-', [x.key_field, x.value_field, x.type]),
  },
  cardinality: {
    reactors: {
      value: 'others',
    },
    defaults: {
      field: null,
    },
  },
  pivot,
  matchCardinality: twoLevelMatch,
  matchStats: twoLevelMatch,
  percentiles: {
    validate: (context) => context.field,
    reactors: {
      value: 'others',
    },
    defaults: {
      field: '',
    },
  },
  percentilesRange: {
    validate: (context) => context.field,
    reactors: {
      value: 'others',
    },
    defaults: {
      field: '',
    },
  },
  smartIntervalHistogram: {
    validate: (context) => context.field,
    reactors: {
      value: 'others',
    },
    defaults: {
      field: '',
    },
  },
  statistical: {
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
    validate: (context) => context.key_field && context.value_field,
    reactors: {
      value: 'others',
    },
    defaults: {
      key_field: '',
      value_field: '',
    },
  },
  subquery: {
    validate: (node) =>
      node.localField && node.foreignField && (node.search || node.searchId),
    reactors: {
      localField: 'all',
      foreignField: 'all',
      search: 'all',
      searchId: 'all',
    },
    defaults: {
      searchId: null,
      search: null,
      localField: null,
      foreignField: null,
    },
  },
  savedSearch: {
    validate: (node) => node.search || node.searchId,
    reactors: {
      search: 'all',
      searchId: 'all',
    },
    defaults: {
      searchId: null,
      search: null,
    },
  },
})
