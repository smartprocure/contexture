let { calcSmartInterval } = require('../../utils/smartInterval')
let { groupStats } = require('./groupStatUtils')

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

module.exports = groupStats(buildGroupQuery)