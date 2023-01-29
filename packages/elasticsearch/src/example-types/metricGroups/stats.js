import { statsAggs, simplifyBucket } from '../../utils/elasticDSL.js'

let buildQuery = ({ statsField, stats }) => statsAggs(statsField, stats)

let result = async (node, search) => {
  let response = await search(buildQuery(node))
  return simplifyBucket(response.aggregations)
}

export default {
  buildQuery,
  validContext: (node) => node.statsField,
  result,
  // Used by metric groups, more convenient API for internal use
  getStats: (search) => (statsField, stats) =>
    result({ statsField, stats }, search),
}
