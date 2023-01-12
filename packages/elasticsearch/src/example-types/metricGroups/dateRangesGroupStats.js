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

let filterGroupRanges = (group, drilldownKey) => {
  if (drilldownKey) {
    let [from, to] = _.map(
      x => new Date(x).toISOString(),
      _.split(/(?<=Z)-/, drilldownKey)
    )
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
