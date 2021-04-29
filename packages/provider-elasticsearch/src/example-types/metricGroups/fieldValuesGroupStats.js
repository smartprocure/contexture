let { statsAggs, simplifyBuckets } = require('../../utils/elasticDSL')
let { buildRegexQueryForWords } = require('../../utils/regex')
let { getField } = require('../../utils/fields')

let getSortField = field => {
  if (field === 'count') return '_count'
  if (field === 'key') return '_key'
  return `${field}.value`
}

let buildQuery = (node, schema) => {
  let {
    statsField,
    stats,
    groupField,
    size = 10,
    filter,
    // sortField can be key, count, or stat name - min, max, avg, sum as long as its in stats
    sort: { field: sortField = 'sum', order = 'desc' } = {}, // todo: support array sort for multi-level
  } = node
  let field = getField(schema, groupField)
  let query = {
    aggs: {
      groups: {
        terms: { field, size, order: { [getSortField(sortField)]: order } },
        ...statsAggs(statsField, stats),
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

module.exports = {
  buildQuery,
  validContext: node => node.groupField,
  async result(node, search, schema) {
    let response = await search(buildQuery(node, schema))
    return {
      results: simplifyBuckets(
        (response.aggregations.valueFilter || response.aggregations).groups
          .buckets
      ),
    }
  },
}
