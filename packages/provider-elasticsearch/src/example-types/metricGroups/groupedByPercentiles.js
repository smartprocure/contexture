let _ = require('lodash/fp')
let F = require('futil')
let { statsAggs, simplifyBuckets } = require('./utils')
let percentiles = require('../percentiles')
let getPercentiles = search => field => percentiles.result({ field }, search)

// [1, 2, 3] -> [{to: 1}, {from: 1, to: 2}, {from: 2, to: 3}, {from: 3}]
let boundariesToRanges = _.flow(
  F.mapIndexed((to, i, list) => F.compactObject({ from: list[i - 1], to })),
  arr => F.push({ from: _.last(arr).to }, arr)
)

let buildQuery = async (node, getPercentiles) => {
  let { statsField, stats, groupField: field } = node
  let {
    percentiles: { values },
  } = await getPercentiles({ field, ...node })
  return {
    aggs: {
      groups: {
        range: { field, ranges: boundariesToRanges(_.map('value', values)) },
        ...statsAggs(statsField, stats),
      },
    },
  }
}

module.exports = {
  buildQuery,
  validContext: node => node.groupField && node.statsField,
  async result(node, search) {
    let response = await search(buildQuery(node, getPercentiles(search)))
    return { results: simplifyBuckets(response.aggregations.groups.buckets) }
  },
}
