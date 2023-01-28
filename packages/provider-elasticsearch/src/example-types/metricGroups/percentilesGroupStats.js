import _ from 'lodash/fp.js'
import F from 'futil'
import { pickSafeNumbers } from '../../utils/futil.js'
import { groupStats } from './groupStatUtils.js'

// [1, 2, 3] -> [{to: 1}, {from: 1, to: 2}, {from: 2, to: 3}, {from: 3}]
let boundariesToRanges = _.flow(
  F.mapIndexed((to, i, list) => F.compactObject({ from: list[i - 1], to })),
  arr => F.push({ from: _.last(arr).to }, arr)
)

let drilldownToRange = drilldown => {
  let [gte, lt] = _.split('-', drilldown)
  return pickSafeNumbers({ gte, lt })
}

let buildGroupQuery = async (node, children, groupsKey, schema, getStats) => {
  let { field, percents, drilldown } = node
  let ranges
  // omit ranges with drilldown otherwise we get null/0s......
  if (drilldown) {
    let { gte, lt } = drilldownToRange(drilldown)
    ranges = [{ from: gte, to: lt }]
  } else {
    let { percentiles } = await getStats(field, { percentiles: { percents } })
    ranges = boundariesToRanges(_.values(percentiles))
  }
  let result = {
    aggs: {
      [groupsKey]: {
        range: { field, ranges },
        ...children,
      },
    },
  }
  return result
}

let drilldown = ({ field, drilldown }) => ({
  range: { [field]: drilldownToRange(drilldown) },
})

export default {
  ...groupStats(buildGroupQuery),
  drilldown,
}
