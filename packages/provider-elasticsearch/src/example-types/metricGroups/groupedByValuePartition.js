let { statsAggs, simplifyBuckets } = require('./utils')

let buildQuery = ({ statsField, stats, groupField, matchValue }) => ({
  aggs: {
    groups: {
      filters: {
        other_bucket_key: 'fail',
        filters: { pass: { term: { [groupField]: matchValue } } },
      },
      ...statsAggs(statsField, stats),
    },
  },
})

module.exports = {
  buildQuery,
  validContext: node => node.groupField && node.statsField,
  async result(node, search) {
    let response = await search(buildQuery(node))
    return {
      results: simplifyBuckets(
        F.unkeyBy('key', response.aggregations.groups.buckets)
      ),
    }
  },
}
