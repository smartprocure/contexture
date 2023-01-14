import _ from 'lodash/fp.js'
import { groupStats } from './groupStatUtils.js'

let { buildQuery, buildGroupQuery, result } = groupStats(
  ({ field, ranges }, children, groupingType) => ({
    aggs: {
      [groupingType]: {
        range: { field, ranges },
        ...children,
      },
    },
  })
)

export { buildQuery, buildGroupQuery, result }

export let drilldown = ({ field, drilldown }) => {
  let [gte, lt] = _.split('-', drilldown)
  return { range: { [field]: { gte, lt } } }
}

export let validContext = node => node.groupField && node.ranges
