let { statsAggs } = require('../../utils/elasticDSL')
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

// can't use util out of the box due to default sort field here only  
let buildQuery = ({ statsField, stats, groupField: field, ...node }, schema) =>
  buildGroupQuery(
    { field, sort: { field: 'sum', ...node.sort }, ...node },
    statsAggs(statsField, stats),
    schema
  )

module.exports = {
  ...groupStats(buildGroupQuery),
  buildQuery
}