const _ = require('lodash/fp')
/*
 1. An empty value as the upper boundary represents infinity.
 2. An empty value as the lower boundary represents negative infinity.
 3. Zero has to be respected as a boundary value.
*/
let boundaryFilter = value => {
  if (_.isString(value) && _.isEmpty(value)) value = NaN
  return _.isNaN(_.toNumber(value)) ? null : _.toNumber(value)
}

let rangeFilter = (field, min, max) => ({
  range: {
    [field]: _.pickBy(_.isNumber, {
      gte: boundaryFilter(min),
      lte: boundaryFilter(max),
    }),
  },
})

let searchResults = async (search, field, min, max, percentileInterval) => {
  let statisticalResult = await search({
    aggs: {
      range_filter: {
        filter: rangeFilter(field, min, max),
        aggs: {
          statistical: {
            stats: {
              field,
              missing: 0,
            },
          },
          all_percentiles: {
            percentiles: {
              field,
              percents: [
                0,
                percentileInterval,
                100 - percentileInterval,
                100,
              ],
            },
          },
        },
      },
    },
  })

  let percentiles = _.flow(_.mapKeys(Number), mappedResult => ({
    rangeMin: mappedResult[0],
    rangeMax: mappedResult[100],
    intervalMin: mappedResult[percentileInterval],
    intervalMax: mappedResult[100 - percentileInterval],
  }))(
    _.get(
      'aggregations.range_filter.all_percentiles.values',
      statisticalResult
    )
  )

  let statistical = _.get(
    'aggregations.range_filter.statistical',
    statisticalResult
  )

  return {
    statistical,
    percentiles,
  }
}

module.exports = {
  hasValue: context => !_.isNil(context.min) || !_.isNil(context.max),
  filter: ({ field, min, max }) => rangeFilter(field, min, max),
  async result({ field, min, max, percentileInterval = 1, rangeThreshold, findBestRange = false }, search) {
    let results

    if (findBestRange) {
      let hasMaxOutlier = true
      let hasMinOutlier = true
      let minValue = min
      let maxValue = max
      let maxIteration = 10
      let iterationCount = 1

      while (hasMaxOutlier || hasMaxOutlier || iterationCount <= maxIteration) {
        results = await searchResults(search, field, minValue, maxValue, percentileInterval)
        let { statistical, percentiles } = results
        let rangeMin = _.get('min', statistical)
        let rangeMax = _.get('max', statistical)
        hasMaxOutlier = percentiles &&
          ((rangeMax - percentiles.intervalMax) / (rangeMax - rangeMin) > rangeThreshold)
        hasMinOutlier = percentiles &&
          ((percentiles.intervalMin - rangeMin) / (rangeMax - rangeMin) > rangeThreshold)
        if (hasMaxOutlier) {
          maxValue = percentiles.intervalMax
        }

        if (hasMinOutlier) {
          minValue = percentiles.intervalMin
        }
        iterationCount++
      }

      results = _.extend(results, {
        extremes: {
          min: minValue,
          max: maxValue
        }
      })
    } else {
      results = await searchResults(search, field, min, max, percentileInterval)
    }

    return results
  },
}
