import { statsAggs, simplifyBuckets } from '../../utils/elasticDSL.js'
import stats from './stats.js'

let { getStats } = stats

// Adds statsAggs to a groupQuery and maps groupField to field
export let buildGroupStatsQuery =
  (buildGroupQuery) =>
  ({ statsField, stats, groupField: field, ...node }, schema, getStats) =>
    buildGroupQuery(
      { statsField, stats, field, ...node },
      statsAggs(statsField, stats),
      'groups',
      schema,
      getStats
    )

// Generic result method - given a buildQuery method, run the search and simplifyBuckets onto results
export let groupStatsResult = (buildQuery) => async (node, search, schema) => {
  let query = await buildQuery(node, schema, getStats(search))
  let response = await search(query)
  let aggs = response.aggregations.valueFilter || response.aggregations
  return { results: simplifyBuckets(aggs.groups.buckets) }
}

// Higher order constructor that stitches it all together - handles most groupStats cases
export let groupStats = (buildGroupQuery) => {
  let buildQuery = buildGroupStatsQuery(buildGroupQuery)
  return {
    buildQuery,
    buildGroupQuery,
    validContext: (node) => node.groupField,
    result: groupStatsResult(buildQuery),
  }
}
