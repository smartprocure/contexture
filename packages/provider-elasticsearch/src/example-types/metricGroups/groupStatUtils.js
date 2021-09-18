let { statsAggs, simplifyBuckets } = require('../../utils/elasticDSL')
let { getStats } = require('./stats')

// Adds statsAggs to a groupQuery and maps groupField to field
let buildGroupStatsQuery = buildGroupQuery =>
  ({ statsField, stats, groupField: field, ...node }, getStats) =>
    buildGroupQuery(
      { field, ...node },
      statsAggs(statsField, stats),
      null,
      getStats
    )

// Generic result method - given a buildQuery method, run the search and simplifyBuckets onto results
let groupStatsResult = buildQuery =>
  async (node, search) => {
    let query = await buildQuery(node, getStats(search))
    let response = await search(query)
    let aggs = response.aggregations.valueFilter || response.aggregations
    return { results: simplifyBuckets( aggs.groups.buckets ) }
  }

// Higher order constructor that stitches it all together - handles most groupStats cases
let groupStats = buildGroupQuery => {
  let buildQuery = buildGroupStatsQuery(buildGroupQuery)
  return {
    buildQuery,
    buildGroupQuery,
    validContext: node => node.groupField,
    result: groupStatsResult(buildQuery),
  }
}

module.exports = {
  groupStats,
  groupStatsResult,
  buildGroupStatsQuery,
}