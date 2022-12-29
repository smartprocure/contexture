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
  let [gte, lt] = _.split(/(?<=Z)-/, drilldown)

  return { range: { [field]: { gte, lt } } }
}

module.exports = {
  ...groupStats(buildGroupQuery),
  validContext: node => node.groupField && node.ranges,
  drilldown,
}
