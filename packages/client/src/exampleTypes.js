import _ from 'lodash/fp'
import F from 'futil'
import { maybeUpdateOn } from './util/futil'

let validateValues = ({ value, values = [] }) => value || values.length
let validateValueExistence = _.flow(_.get('value'), _.negate(_.isNil))

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
      useValues: x => ({ values: x }),
      getValues: x => _.map('name', x.context.options),
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
    label: 'Matches',
    validate: _.get('tags.length'),
    reactors: {
      join: 'others',
      tags: 'all',
      exact: 'all',
    },
    defaults: {
      field: null,
      tags: [],
      join: 'any',
      exact: false,
      context: {
        results: {},
      },
    },
  },
  mongoId: {
    validate: validateValues,
    reactors: {
      value: 'others',
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
        results: [],
        totalRecords: null,
      },
    },
    onUpdateByOthers(node, extend) {
      extend(node, { page: 1 })
    },
    shouldMergeResponse: node => node.infiniteScroll,
    mergeResponse(node, response, extend) {
      // extend but merge results arrays
      extend(node.context, {
        ...response.context,
        results: [...node.context.results, ...response.context.results],
      })
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
      getValues: x => _.map('key', x.context.terms),
    },
    autoKey: x => F.compactJoin('-', [x.key_field, x.value_field, x.type]),
  },
  cardinality: {
    reactors: {
      value: 'others',
    },
    defaults: {
      field: null,
    },
  },
  pivot: {
    validate: context =>
      _.every(
        ({ type, ranges, percents }) =>
          (type !== 'numberRanges' && type !== 'percentiles') ||
          (type === 'numberRanges' && ranges.length > 0) ||
          (type === 'percentiles' && percents.length > 0),
        _.concat(context.columns, context.groups)
      ),
    reactors: {
      columns: 'self',
      groups: 'self',
      values: 'self',
      drilldown: 'self',
      flatten: 'self',
      subtotals: 'self',
    },
    defaults: {
      columns: [],
      groups: [],
      values: [],
      drilldown: null,
      flatten: false,
      subtotals: false,
      context: {
        results: [],
      },
    },
    onDispatch(event, extend) {
      // If mutating any group type specific "resetting" keys, set `forceReplaceResponse`
      let { type, node, previous } = event
      if (type === 'mutate') {
        F.mapIndexed((group, i) => {
          let previousGroup = previous.groups[i]
          let type = group.type
          let mutatedKeys = _.keys(F.simpleDiff(previousGroup, group))
          let resettingKeys = {
            fieldValuesPartition: ['matchValue'],
          }
          if (!_.isEmpty(_.intersection(mutatedKeys, resettingKeys[type])))
            extend(node, { forceReplaceResponse: true })
        }, node.groups)
      }
    },
    shouldMergeResponse: node => !_.isEmpty(node.drilldown),
    mergeResponse(node, response, extend, snapshot) {
      // Convert response groups and columns to objects for easy merges
      let groupsToObjects = _.flow(
        maybeUpdateOn(
          'groups',
          _.flow(
            _.map(x => groupsToObjects(x)),
            _.keyBy('key')
          )
        ),
        maybeUpdateOn(
          'columns',
          _.flow(
            _.map(x => groupsToObjects(x)),
            _.keyBy('key')
          )
        )
      )
      // Convert groups and columns back to arrays
      let groupsToArrays = _.flow(
        maybeUpdateOn(
          'groups',
          _.flow(
            F.unkeyBy('key'),
            _.map(x => groupsToArrays(x))
          )
        ),
        maybeUpdateOn(
          'columns',
          _.flow(
            F.unkeyBy('key'),
            _.map(x => groupsToArrays(x))
          )
        )
      )

      // `snapshot` here is to solve a mobx issue
      // wrap in `groups` so it traverses the root level
      let nodeGroups = groupsToObjects({
        groups: snapshot(node.context.results),
      })
      let responseGroups = groupsToObjects({
        groups: response.context.results,
      })

      // Easy merge now that we can merge by group key
      let results = F.mergeAllArrays([nodeGroups, responseGroups])

      // Grab `groups` property we artifically added above for easy traversals
      let context = { results: groupsToArrays(results).groups }

      // Write on the node
      extend(node, { context })
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
    validate: node => node.search || node.searchId,
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
