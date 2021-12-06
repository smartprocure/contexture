let F = require('futil')
let { simplifyBuckets } = require('../../utils/elasticDSL')
let { getField } = require('../../utils/fields')
let { buildGroupStatsQuery } = require('./groupStatUtils')

let drilldown = ({ field, matchValue, drilldown }, schema) => {
  let filter = { term: { [getField(schema, field)]: matchValue } }
  if (drilldown === 'pass') return filter
  if (drilldown === 'fail') return { bool: { must_not: [filter] } }
}

let buildGroupQuery = ({ field, matchValue }, children, schema) => ({
  aggs: {
    groups: {
      filters: {
        other_bucket_key: 'fail',
        filters: {
          pass: { term: { [getField(schema, field)]: matchValue } },
        },
      },
      ...children,
    },
  },
})
let buildQuery = buildGroupStatsQuery(buildGroupQuery)

let getGroups = aggs => F.unkeyBy('key', aggs.groups.buckets)
module.exports = {
  getGroups,
  buildQuery,
  buildGroupQuery,
  validContext: node => node.groupField,
  async result(node, search, schema) {
    let query = buildQuery(node, schema)
    let response = await search(query)
    return { results: simplifyBuckets(getGroups(response.aggregations)) }
  },
  drilldown,
}
