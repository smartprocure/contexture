import _ from 'lodash/fp.js'
import { calcSmartInterval } from '../../utils/smartInterval.js'
import { groupStats } from './groupStatUtils.js'

let drilldown = async ({ field, drilldown, interval }, schema, getStats) => {
  let gte = _.toNumber(drilldown)
  if (interval === 'smart') {
    let { min, max } = await getStats(field, ['min', 'max'])
    interval = calcSmartInterval(min, max)
  }
  let lt = gte + _.toNumber(interval)
  return { range: { [field]: { gte, lt } } }
}

let buildGroupQuery = async (node, children, groupsKey, schema, getStats) => {
  let { field, interval = 'smart' } = node
  if (interval === 'smart') {
    let { min, max } = await getStats(field, ['min', 'max'])
    interval = calcSmartInterval(min, max)
  }

  return {
    aggs: {
      [groupsKey]: {
        histogram: { field, interval, min_doc_count: 0 },
        ...children,
      },
    },
  }
}

export default {
  ...groupStats(buildGroupQuery),
  drilldown,
}
