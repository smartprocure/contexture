let F = require('futil')
let { simplifyBuckets } = require('../../utils/elasticDSL')
let { getField } = require('../../utils/fields')
let { buildGroupStatsQuery } = require('./groupStatUtils')

let buildGroupQuery = ({ field, matchValue }, children, schema) => ({
  aggs: {
    groups: {
      filters: {
        other_bucket_key: 'fail',
        filters: {
          pass: { term: { [getField(schema, field)]: matchValue } },
        },
      },
      ...children
    },
  },
})
let buildQuery = buildGroupStatsQuery(buildGroupQuery)

module.exports = {
  buildQuery,
  buildGroupQuery,
  validContext: node => node.groupField,
  async result(node, search, schema) {
    let query = buildQuery(node, schema)
    let response = await search(query)
    return {
      results: simplifyBuckets(
        F.unkeyBy('key', response.aggregations.groups.buckets)
      ),
    }
  },
}
