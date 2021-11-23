let _ = require('lodash/fp')
let F = require('futil')
let { groupStats } = require('./groupStatUtils')

// [1, 2, 3] -> [{to: 1}, {from: 1, to: 2}, {from: 2, to: 3}, {from: 3}]
let boundariesToRanges = _.flow(
  F.mapIndexed((to, i, list) => F.compactObject({ from: list[i - 1], to })),
  arr => F.push({ from: _.last(arr).to }, arr)
)

let buildGroupQuery = async (node, children, schema, getStats) => {
  let { field, percents } = node
  // todo: Support keyed?
  let { percentiles } = await getStats(field, { percentiles: { percents } })
  return {
    aggs: {
      groups: {
        range: {
          field,
          ranges: boundariesToRanges(_.map('value', percentiles)),
        },
        ...children,
      },
    },
  }
}

module.exports = module.exports = groupStats(buildGroupQuery)
