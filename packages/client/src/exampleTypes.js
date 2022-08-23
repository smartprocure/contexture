import _ from 'lodash/fp'
import F from 'futil'
import { deepMultiTransformOn } from './util/futil'

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

let getKey = x => x.keyAsString || x.key

let drilldownLookup = (type, path, results)=> {
  if (_.isEmpty(path)) return results

  let key = _.first(path)
  let groups = _.get(type, results)
  let match = _.find((node) => getKey(node) === key, groups)
  return drilldownLookup(type, path.slice(1), match)
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
      extend(node, {
        context: {
          ...response.context,
          results: [...node.context.results, ...response.context.results],
        },
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
        _.concat(context.columns, context.rows)
      ),
    reactors: {
      columns: 'self',
      rows: 'self',
      values: 'self',
      pagination: 'self',
      filters: 'others',
      sort: 'self',
    },
    defaults: {
      columns: [],
      rows: [],
      values: [],
      filters: [],
      sort: {},
      pagination: {
        columns: {
          drilldown: null,
          skip: [],
          expanded: [],
        },
        rows: {
          drilldown: null,
          skip: [],
          expanded: [],
        },
      },
      showCounts: false,
      context: {
        results: [],
      },
    },
    onDispatch(event, extend) {
      let { type, node, previous, value } = event

      if (type === 'mutate') {
        let prevRowDrill = _.get('pagination.rows.drilldown', previous)
        let prevColumnDrill = _.get('pagination.columns.drilldown', previous)

        // TODO allow mutation for expanded when collapsing levels

        // If mutation is a pagination
        if (
          _.has('pagination.columns', value) ||
          _.has('pagination.rows', value)
        ) {
          let isRowPagination = _.has('pagination.rows', value)

          let getPrevPage = type => {
            let page = _.flow(
              _.get(['pagination', type]),
              _.pick(['drilldown', 'skip']),
            )(previous)

            if (page){
              // adding include for the first page only if expanded is empty yet
              if (_.isEmpty(page.drilldown) && _.isEmpty(page.skip) &&
                !_.isEmpty(_.get(['pagination', type, 'expanded'], previous))
              )
                return false

              let results = drilldownLookup(type, page.drilldown,  _.get('context.results', node))

              page.include = _.flow(
                _.get(type),
                _.map(getKey),
                _.without(page.skip)
              )(results)
            }

            return page
          }

          let prevRowPage = getPrevPage('rows')
          let prevColumnPage = getPrevPage('columns')

          // Preserving previous pagination entries in the expanded prop
          extend(node, {
            pagination: {
              columns: {
                ...(!isRowPagination
                  ? value.pagination.columns
                  : {
                      drilldown: prevColumnDrill && [],
                      skip: [],
                    }),
                expanded: _.compact([
                  ..._.getOr([], 'pagination.columns.expanded', previous),
                  prevColumnPage,
                ]),
              },
              rows: {
                ...(isRowPagination
                  ? value.pagination.rows
                  : {
                      drilldown: prevRowDrill && [],
                      skip: [],
                    }),
                expanded: _.compact([
                  ..._.getOr([], 'pagination.rows.expanded', previous),
                  prevRowPage,
                ]),
              },
            },
          })
          // If drilldown mode is enabled for columns or rows
        } else if (prevColumnDrill || prevRowDrill)
          // Resetting the pagination when the pivot node is changed
          // allows to return expected root results instead of nested drilldown
          // EX: changing the columns or rows config was not returning the new results
          extend(node, {
            pagination: {
              columns: {
                drilldown: prevColumnDrill && [],
                skip: [],
                expanded: [],
              },
              rows: {
                drilldown: prevRowDrill && [],
                skip: [],
                expanded: [],
              },
            },
          })
      }
    },
    // Resetting the pagination when the tree is changed
    // allows to return expected root results instead of nested drilldown
    // EX: criteria filters didn't work properly when drilldown was applied
    onUpdateByOthers(node, extend) {
      let rowDrill = _.get('pagination.rows.drilldown', node)
      let columnDrill = _.get('pagination.columns.drilldown', node)
      if (columnDrill || rowDrill)
        extend(node, {
          pagination: {
            columns: {
              drilldown: columnDrill && [],
              skip: [],
              expanded: [],
            },
            rows: {
              drilldown: rowDrill && [],
              skip: [],
              expanded: [],
            },
          },
        })
    },
    shouldMergeResponse: node =>
      // checking for presence of drilldown, skip, expanded in pagination
      _.flow(
        _.flatMapDeep(type =>
          _.map(prop => _.get(['pagination', type, prop], node), [
            'drilldown',
            'skip',
            'expanded',
          ])
        ),
        _.some(_.negate(_.isEmpty))
      )(['columns', 'rows']),
    mergeResponse(node, response, extend, snapshot) {
      // Convert response rows and columns to objects for easy merges
      let groupsToObjects = deepMultiTransformOn(
        ['rows', 'columns'],
        groupsToObjects => _.flow(_.map(groupsToObjects), _.keyBy('key'))
      )
      // Convert rows and columns back to arrays
      let groupsToArrays = deepMultiTransformOn(
        ['rows', 'columns'],
        groupsToArrays => _.flow(_.values, _.map(groupsToArrays))
      )

      // `snapshot` here is to solve a mobx issue
      let nodeGroups = groupsToObjects(snapshot(node.context.results))
      let responseGroups = groupsToObjects(response.context.results)

      // Easy merge now that we can merge by row key
      let results = F.mergeAllArrays([nodeGroups, responseGroups])

      let context = { results: groupsToArrays(results) }

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
