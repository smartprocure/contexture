let { statsAggs, simplifyBuckets } = require('../../utils/elasticDSL')

let buildQuery = ({ groupField, statsField, stats, interval = 'year' }) => ({
  aggs: {
    groups: {
      date_histogram: { field: groupField, interval, min_doc_count: 0 },
      ...statsAggs(statsField, stats),
    },
  },
})

module.exports = {
  buildQuery,
  validContext: node => node.groupField,
  async result(node, search) {
    let response = await search(buildQuery(node))
    return { results: simplifyBuckets(response.aggregations.groups.buckets) }
  },
}
