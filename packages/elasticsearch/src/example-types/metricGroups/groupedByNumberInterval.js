let { statsAggs, simplifyBuckets } = require('./utils')
let { calcSmartInterval } = require('../../utils/smartInterval')
// let statistical = require('../statistical')
// let getMinMax = search => field => statistical.result({ field }, search)
let stats = require('./stats')
let getMinMax = search => field =>
  stats.result({ statsField: field, stats: ['min', 'max'] }, search)

let buildQuery = async (node, getMinMax) => {
  let { statsField, stats, groupField: field, interval = 'smart' } = node
  if (interval === 'smart') {
    let { min, max } = await getMinMax(field)
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
  validContext: node => node.groupField && node.statsField,
  async result(node, search) {
    let response = await search(await buildQuery(node, getMinMax(search)))
    return { results: simplifyBuckets(response.aggregations.groups.buckets) }
  },
}
