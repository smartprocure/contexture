import _ from 'lodash/fp.js'
import { groupStats } from './groupStatUtils.js'

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

export default {
  ...groupStats(buildGroupQuery),
  validContext: node => node.groupField && node.ranges,
  drilldown,
}
