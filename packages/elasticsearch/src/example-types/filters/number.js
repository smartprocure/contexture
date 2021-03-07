let _ = require('lodash/fp')
let { pickSafeNumbers } = require('../../utils/futil')

let filter = ({ field, min, max }) => ({
  range: { [field]: pickSafeNumbers({ gte: min, lte: max }) },
})

let buildQuery = (field, min, max, interval) => ({
  aggs: {
    rangeFilter: {
      filter: filter({ field, min, max }),
      aggs: {
        percentiles: {
          percentiles: { field, percents: [0, interval, 100 - interval, 100] },
        },
      },
    },
  },
})

let hasOutliers = (percentiles, rangeThreshold) => {
  if (!percentiles) return {}
  let { min, max, subsetMin, subsetMax } = percentiles
  let range = max - min
  return {
    hasMin: (subsetMin - min) / range > rangeThreshold,
    hasMax: (max - subsetMax) / range > rangeThreshold,
  }
}

// Runs multiple iterations of the query while there are still outliers and remaining iterations
let result = async (node, search) => {
  let { field, min, max, percentileInterval = 1, rangeThreshold = 0.1 } = node
  let iteration = 0
  let maxIterations = 10
  let outliers = { hasMin: true, hasMax: true }

  while ((outliers.hasMin || outliers.hasMax) && iteration < maxIterations) {
    let results = _.flow(
      _.get('aggregations.rangeFilter.percentiles.values'),
      _.mapKeys(_.toNumber)
    )(await search(buildQuery(field, min, max, percentileInterval)))
    let percentiles = {
      min: results[0],
      max: results[100],
      subsetMin: results[percentileInterval],
      subsetMax: results[100 - percentileInterval],
    }
    outliers = hasOutliers(percentiles, rangeThreshold)
    if (outliers.hasMin) min = percentiles.subsetMin
    if (outliers.hasMax) max = percentiles.subsetMax
    iteration++
  }

  return { bestRange: { min, max } }
}

module.exports = {
  hasValue: ({ min, max }) => !_.isNil(min) || !_.isNil(max),
  filter,
  validContext: node => node.findBestRange,
  result,
  buildQuery,
}
