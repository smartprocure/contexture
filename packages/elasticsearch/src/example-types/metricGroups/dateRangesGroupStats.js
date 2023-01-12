let _ = require('lodash/fp')
let { groupStats } = require('./groupStatUtils')

let splitDrilldown = (drilldown, fn = _.identity) =>
  _.map(fn, _.split(/(?<=Z)-/, drilldown))

let buildGroupQuery = ({ field, ranges }, children, groupingType) => ({
  aggs: {
    [groupingType]: {
      date_range: { field, ranges },
      ...children,
    },
  },
})

let drilldown = ({ field, drilldown }) => {
  let [gte, lt] = splitDrilldown(drilldown)

  return { range: { [field]: { gte, lt } } }
}

let filterGroupRanges = (group, drilldown) => {
  if (drilldown) {
    let [from, to] = splitDrilldown(drilldown, x => new Date(x).toISOString())
    group.ranges = _.filter(
      x =>
        new Date(x.from).toISOString() === from &&
        new Date(x.to).toISOString() === to,
      group.ranges
    )
  }

  return group
}

module.exports = {
  ...groupStats(buildGroupQuery),
  validContext: node => node.groupField && node.ranges,
  drilldown,
  filterGroupRanges,
}
