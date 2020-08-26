let { statsAggs, simplifyAggregations } = require('./utils')

let buildQuery = ({ statsField, stats }) => statsAggs(statsField, stats)

module.exports = {
  buildQuery,
  validContext: node => node.groupField && node.statsField,
  async result(node, search) {
    let response = await search(buildQuery(node))
    return simplifyAggregations(response.aggregations)
  },
}
