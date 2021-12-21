let _ = require('lodash/fp')
let { calcSmartInterval } = require('../../utils/smartInterval')
let { groupStats } = require('./groupStatUtils')

let drilldown = async ({ field, drilldown, interval }, schema, getStats) => {
  let gte = _.toNumber(drilldown)
  if (interval === 'smart') {
    let { min, max } = await getStats(field, ['min', 'max'])
    interval = calcSmartInterval(min, max)
  }
  let lt = gte + _.toNumber(interval)
  return { range: { [field]: { gte, lt } } }
}

let buildGroupQuery = async (node, children, schema, getStats) => {
  let { field, interval = 'smart' } = node
  if (interval === 'smart') {
    let { min, max } = await getStats(field, ['min', 'max'])
    interval = calcSmartInterval(min, max)
  }

  return {
    aggs: {
      groups: {
        histogram: { field, interval, min_doc_count: 0 },
        ...children,
      },
    },
  }
}

module.exports = {
  ...groupStats(buildGroupQuery),
  drilldown,
}
