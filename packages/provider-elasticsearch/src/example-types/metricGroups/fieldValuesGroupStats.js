import _ from 'lodash/fp.js'
import { buildRegexQueryForWords } from '../../utils/regex.js'
import { getField } from '../../utils/fields.js'
import { groupStats } from './groupStatUtils.js'

let getSortField = (field) => {
  if (field === 'count') return '_count'
  if (field === 'key') return '_key'
  return field
}

let drilldown = ({ field, drilldown, additionalFields = [] }, schema) =>
  // value is a pipe-delimited list of values when drilldown is using additional fields (multi-term aggregation)
  _.zipWith(
    (field, value) => ({ term: { [getField(schema, field)]: value } }),
    [field, ...additionalFields],
    _.split('|', drilldown)
  )

let buildGroupQuery = (node, children, groupingType, schema) => {
  let {
    field: groupField,
    size = 10,
    filter,
    // sortField can be key, count, or stat name - min, max, avg, sum as long as its in stats
    sort: { field: sortField, direction = 'desc' } = {}, // todo: support array sort for multi-level
    additionalFields = [],
  } = node

  let termsAgg = {
    size,
    ...(sortField && { order: { [getSortField(sortField)]: direction } }),
  }
  let fields = _.map(
    _.flow(getField(schema), (field) => ({ field })),
    [groupField, ...additionalFields]
  )
  let field = getField(schema, groupField)

  let query = {
    aggs: {
      [groupingType]: {
        ...(_.isEmpty(additionalFields)
          ? { terms: { ...termsAgg, field } }
          : { multi_terms: { ...termsAgg, terms: fields } }),
        ...children,
      },
    },
  }
  if (filter)
    query = {
      aggs: {
        valueFilter: {
          filter: buildRegexQueryForWords(field)(filter),
          ...query,
        },
      },
    }
  return query
}

let buildGroupQueryWithDefaultSortField = (node, ...args) =>
  buildGroupQuery(_.defaultsDeep({ sort: { field: 'sum' } }, node), ...args)

let getGroups = (aggs) => (aggs.valueFilter || aggs).groups.buckets

let addGroupCount = (query, group, type, schema) =>
  _.merge(query, {
    aggs: {
      [`${type}GroupCount`]: {
        cardinality: {
          field: getField(schema, group.field),
          precision_threshold: 100, // less load on ES
        },
      },
    },
  })

// We don't want the default sort field for pivot, but we do for this node type
export default {
  ...groupStats(buildGroupQueryWithDefaultSortField),
  buildGroupQuery,
  getGroups,
  drilldown,
  addGroupCount,
}
