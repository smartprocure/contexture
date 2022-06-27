let _ = require('lodash/fp')
let { buildRegexQueryForWords } = require('../../utils/regex')
let { getField } = require('../../utils/fields')
let { groupStats } = require('./groupStatUtils')

let getSortField = field => {
  if (field === 'count') return '_count'
  if (field === 'key') return '_key'
  return field
}

let drilldown = ({ field, drilldown }, schema) => ({
  term: { [getField(schema, field)]: drilldown },
})

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
  let fields = _.map(getField(schema), [groupField, ...additionalFields])
  let field = [fields]
  
  let query = {
    aggs: {
      [groupingType]: {
        ...(_.isEmpty(additionalFields)
          ? { terms: { ...termsAgg, field } }
          : { multi_terms: { ...termsAgg, fields } }),
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

let getGroups = aggs => (aggs.valueFilter || aggs).groups.buckets

// We don't want the default sort field for pivot, but we do for this node type
module.exports = {
  ...groupStats(buildGroupQueryWithDefaultSortField),
  buildGroupQuery,
  getGroups,
  drilldown,
}
