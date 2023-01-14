import { statsAggs, simplifyBucket } from '../../utils/elasticDSL.js'

export let buildQuery = ({ statsField, stats }) => statsAggs(statsField, stats)

export let result = async (node, search) => {
  let response = await search(buildQuery(node))
  return simplifyBucket(response.aggregations)
}

export let validContext = node => node.statsField

// Used by metric groups, more convenient API for internal use
export let getStats = search => (statsField, stats) =>
  result({ statsField, stats }, search)
