let { statsAggs, simplifyBuckets } = require('../../utils/elasticDSL')
let { calcSmartInterval } = require('../../utils/smartInterval')
let { getStats } = require('./stats')

let buildQuery = async (node, getStats) => {
  let { statsField, stats, groupField: field, interval = 'smart' } = node
  if (interval === 'smart') {
    let { min, max } = await getStats(field, ['min', 'max'])
    interval = calcSmartInterval(min, max)
  }

  return {
    aggs: {
      groups: {
        histogram: { field, interval, min_doc_count: 0 },
        ...statsAggs(statsField, stats),
      },
    },
  }
}

module.exports = {
  buildQuery,
  validContext: node => node.groupField,
  async result(node, search) {
    let response = await search(await buildQuery(node, getStats(search)))
    return { results: simplifyBuckets(response.aggregations.groups.buckets) }
  },
}
