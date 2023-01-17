import F from 'futil'
import { simplifyBuckets } from '../../utils/elasticDSL.js'
import { getField } from '../../utils/fields.js'
import { buildGroupStatsQuery } from './groupStatUtils.js'

let drilldown = ({ field, matchValue, drilldown }, schema) => {
  let filter = { term: { [getField(schema, field)]: matchValue } }
  if (drilldown === 'pass') return filter
  if (drilldown === 'fail') return { bool: { must_not: [filter] } }
}

let buildGroupQuery = ({ field, matchValue }, children, groupKey, schema) => ({
  aggs: {
    [groupKey]: {
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
export default {
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
