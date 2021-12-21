let _ = require('lodash/fp')
let { groupStats } = require('./groupStatUtils')

let buildGroupQuery = ({ field, ranges }, children) => ({
  aggs: {
    groups: {
      range: { field, ranges },
      ...children,
    },
  },
})

let drilldown = ({ field, drilldown }) => {
  let [gte, lte] = _.split('-', drilldown)
  return { range: { [field]: { gte, lte } } }
}

module.exports = {
  ...groupStats(buildGroupQuery),
  validContext: node => node.groupField && node.ranges,
  drilldown,
}
