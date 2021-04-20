let F = require('futil')
let { statsAggs, simplifyBuckets } = require('../../utils/elasticDSL')
let { getField } = require('../../utils/fields')

let buildQuery = ({ statsField, stats, groupField, matchValue }, schema) => ({
  aggs: {
    groups: {
      filters: {
        other_bucket_key: 'fail',
        filters: {
          pass: { term: { [getField(schema, groupField)]: matchValue } },
        },
      },
      ...statsAggs(statsField, stats),
    },
  },
})

module.exports = {
  buildQuery,
  validContext: node => node.groupField,
  async result(node, search, schema) {
    let response = await search(buildQuery(node, schema))
    return {
      results: simplifyBuckets(
        F.unkeyBy('key', response.aggregations.groups.buckets)
      ),
    }
  },
}
