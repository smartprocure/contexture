let { groupStats } = require('./groupStatUtils')

let buildGroupQuery = ({ field, ranges }, children) => ({
  aggs: {
    groups: {
      range: { field, ranges },
      ...children,
    },
  },
})

module.exports = {
  ...groupStats(buildGroupQuery),
  validContext: node => node.groupField && node.ranges,
}
