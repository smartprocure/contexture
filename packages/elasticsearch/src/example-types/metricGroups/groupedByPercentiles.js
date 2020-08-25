let _ = require('lodash/fp')
let F = require('futil')
let { statsAggs, simplifyBuckets } = require('./utils')
let percentiles = require('../percentiles')
let getPercentiles = search => field => percentiles.result({ field }, search)

let buildQuery = async (node, getPercentiles) => {
  let { statsField, stats, groupField: field, percents } = node
  let percentilesResult = await getPercentiles({ field, ...node})
  let percentilesArray = _.get('percentiles.values', percentilesResult)
  
  let ranges = []
  _.each(range => {
    let index = _.indexOf(range, percents)
    let percentileObj = _.find({ key: range }, percentilesArray)
    if (index === 0) return ranges.push({ to: percentileObj.value })
    else {
      ranges.push({
        from: _.last(ranges).to,
        to: percentileObj.value,
      })
      if (index === percents.length - 1)
        ranges.push({ from: percentileObj.value })
      else
        ranges.push({
          from: percentileObj.value,
          to: percentilesArray[index + 1].value,
        })
    }
  }, percents)

  return {
    aggs: {
      groups: {
        range: { field, ranges },
        ...statsAggs(statsField, stats)
      },
    },
  }
}

module.exports = {
  buildQuery,
  validContext: (node) => node.groupField && node.statsField,
  result: async (node, search) => {
    let response = await search(buildQuery(node, getPercentiles(search)))
    return { results: simplifyBuckets(response.aggregations.groups.buckets) }
  },
}
