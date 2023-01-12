let _ = require('lodash/fp')
let { groupStats } = require('./groupStatUtils')

let splitDrilldown = (drilldown, fn = _.identity) =>
  _.map(fn, _.split(/(?<=Z)-/, drilldown))

let buildGroupQuery = (
  { field, ranges },
  children,
  groupingType,
  _schema,
  _getStats,
  drilldownKey
) => {
  if (drilldownKey) {
    let [from, to] = splitDrilldown(drilldownKey, x =>
      new Date(x).toISOString()
    )
    ranges = _.filter(
      x =>
        new Date(x.from).toISOString() === from &&
        new Date(x.to).toISOString() === to,
      ranges
    )
  }

  return {
    aggs: {
      [groupingType]: {
        date_range: { field, ranges },
        ...children,
      },
    },
  }
}

let drilldown = ({ field, drilldown }) => {
  let [gte, lt] = splitDrilldown(drilldown)

  return { range: { [field]: { gte, lt } } }
}

module.exports = {
  ...groupStats(buildGroupQuery),
  validContext: node => node.groupField && node.ranges,
  drilldown,
}
