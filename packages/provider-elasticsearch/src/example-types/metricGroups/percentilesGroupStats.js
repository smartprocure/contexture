let _ = require('lodash/fp')
let F = require('futil')
let { statsAggs, simplifyBuckets } = require('../../utils/elasticDSL')
let { getStats } = require('./stats')

// [1, 2, 3] -> [{to: 1}, {from: 1, to: 2}, {from: 2, to: 3}, {from: 3}]
let boundariesToRanges = _.flow(
  F.mapIndexed((to, i, list) => F.compactObject({ from: list[i - 1], to })),
  arr => F.push({ from: _.last(arr).to }, arr)
)

let buildQuery = async (node, getStats) => {
  let { statsField, stats, groupField: field, percents } = node
  // todo: Support keyed?
  let { percentiles } = await getStats(field, { percentiles: { percents } })
  return {
    aggs: {
      groups: {
        range: {
          field,
          ranges: boundariesToRanges(_.map('value', percentiles)),
        },
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
