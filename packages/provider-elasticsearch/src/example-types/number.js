const _ = require('lodash/fp')
const util = require('./numberUtil')

module.exports = {
  hasValue: node => !_.isNil(node.min) || !_.isNil(node.max),
  filter: ({ field, min, max }) => util.rangeFilter(field, min, max),
  async result(
    {
      field,
      min,
      max,
      percentileInterval = 1,
      rangeThreshold = 0.1,
      findBestRange = false,
    },
    search
  ) {
    let results

    if (findBestRange) {
      let hasMaxOutlier = true
      let hasMinOutlier = true
      let minValue = min
      let maxValue = max
      let maxIteration = 10
      let iterationCount = 1

      while (
        (hasMinOutlier || hasMaxOutlier) &&
        iterationCount <= maxIteration
      ) {
        results = await util.getStatisticalResults(
          search,
          field,
          minValue,
          maxValue,
          percentileInterval
        )

        let { statistical, percentiles } = results
        let rangeMin = _.get('min', statistical)
        let rangeMax = _.get('max', statistical)
        hasMaxOutlier =
          percentiles &&
          (rangeMax - percentiles.intervalMax) / (rangeMax - rangeMin) >
            rangeThreshold
        hasMinOutlier =
          percentiles &&
          (percentiles.intervalMin - rangeMin) / (rangeMax - rangeMin) >
            rangeThreshold
        if (hasMaxOutlier) {
          maxValue = percentiles.intervalMax
        }

        if (hasMinOutlier) {
          minValue = percentiles.intervalMin
        }
        iterationCount++
      }

      results = _.extend(results, {
        bestRange: {
          min: minValue,
          max: maxValue,
        },
      })
    } else {
      results = await util.getStatisticalResults(
        search,
        field,
        min,
        max,
        percentileInterval
      )
    }

    return results
  },
}
