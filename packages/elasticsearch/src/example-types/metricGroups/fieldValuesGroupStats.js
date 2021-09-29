let _ = require('lodash/fp')
let { buildRegexQueryForWords } = require('../../utils/regex')
let { getField } = require('../../utils/fields')
let { groupStats } = require('./groupStatUtils')

let getSortField = field => {
  if (field === 'count') return '_count'
  if (field === 'key') return '_key'
  return `${field}.value`
}

let buildGroupQuery = (node, children, schema) => {
  let {
    field: groupField,
    size = 10,
    filter,
    // sortField can be key, count, or stat name - min, max, avg, sum as long as its in stats
    sort: { field: sortField, order = 'desc' } = {}, // todo: support array sort for multi-level
  } = node
  let field = getField(schema, groupField)
  let query = {
    aggs: {
      groups: {
        terms: {
          field,
          size, 
          ...sortField && { order: { [getSortField(sortField)]: order } },
        },
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

// We don't want the default sort field for pivot, but we do for this node type
module.exports = {
  ...groupStats(buildGroupQueryWithDefaultSortField),
  buildGroupQuery
}