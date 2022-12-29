let _ = require('lodash/fp')
let { groupStats } = require('./groupStatUtils')

let buildGroupQuery = ({ field, ranges }, children, groupingType) => ({
  aggs: {
    [groupingType]: {
      date_range: { field, ranges },
      ...children,
    },
  },
})

let drilldown = ({ field, drilldown }) => {
  let separatorIndex = _.floor(drilldown.length / 2)
  let gte = drilldown.slice(0, separatorIndex)
  let lt = drilldown.slice(separatorIndex + 1, drilldown.length)

  return { range: { [field]: { gte, lt } } }
}

module.exports = {
  ...groupStats(buildGroupQuery),
  validContext: node => node.groupField && node.ranges,
  drilldown,
}
