let { statsAggs, simplifyBuckets } = require('../../utils/elasticDSL')

let buildQuery = ({ groupField: field, statsField, stats, ranges }) => ({
  aggs: {
    groups: {
      range: { field, ranges },
      ...statsAggs(statsField, stats),
    },
  },
})

module.exports = {
  buildQuery,
  validContext: node => node.groupField && node.ranges,
  async result(node, search) {
    let response = await search(buildQuery(node))
    return { results: simplifyBuckets(response.aggregations.groups.buckets) }
  },
}
