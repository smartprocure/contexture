let _ = require('lodash/fp')
let { groupStats } = require('./groupStatUtils')

let buildGroupQuery = (
  { field, ranges },
  children,
  groupingType,
  _schema,
  _getStats,
  drilldownKey
) => {
  if (drilldownKey) {
    let [from, to] = _.map(parseFloat, _.split('-', drilldownKey))
    ranges = _.filter(
      x => parseFloat(x.from) === from && parseFloat(x.to) === to,
      ranges
    )
  }

  return {
    aggs: {
      [groupingType]: {
        range: { field, ranges },
        ...children,
      },
    },
  }
}

let drilldown = ({ field, drilldown }) => {
  let [gte, lt] = _.split('-', drilldown)
  return { range: { [field]: { gte, lt } } }
}

module.exports = {
  ...groupStats(buildGroupQuery),
  validContext: node => node.groupField && node.ranges,
  drilldown,
}
