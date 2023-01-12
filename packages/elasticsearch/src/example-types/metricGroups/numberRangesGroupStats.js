let _ = require('lodash/fp')
let { groupStats } = require('./groupStatUtils')

let buildGroupQuery = ({ field, ranges }, children, groupingType) => ({
  aggs: {
    [groupingType]: {
      range: { field, ranges },
      ...children,
    },
  },
})

let drilldown = ({ field, drilldown }) => {
  let [gte, lt] = _.split('-', drilldown)
  return { range: { [field]: { gte, lt } } }
}

let filterGroupRanges = (group, drilldownKey) => {
  if (drilldownKey) {
    let [from, to] = _.map(parseFloat, _.split('-', drilldownKey))
    group.ranges = _.filter(
      x => parseFloat(x.from) === from && parseFloat(x.to) === to,
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
