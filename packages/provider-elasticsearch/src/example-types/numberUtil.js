const _ = require('lodash/fp')

/*
 1. An empty value as the upper boundary represents infinity.
 2. An empty value as the lower boundary represents negative infinity.
 3. Zero has to be respected as a boundary value.
*/
let boundaryFilter = value =>
    _.isNil(value) || (_.isString(value) && _.isEmpty(value))
    ? undefined
    : _.toNumber(value)

let rangeFilter = (field, min, max) => ({
  range: {
    [field]: _.pickBy(_.isNumber, {
      gte: boundaryFilter(min),
      lte: boundaryFilter(max)
    }),
  },
})

module.exports = {
  rangeFilter,
  async getStatisticalResults(search, field, min, max, percentileInterval) {
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
  },
}
