const _ = require('lodash/fp')

/*
 1. A null, undefined, or an empty string value 
    resolves to undefined.
 2. This causes the properties gte and lte to be undefined
    if the value is undefined.
 3. ElasticSearch interprets the absence of presence of lte 
    or gte properties as open or closed left or right intervals.
*/
let boundaryFilter = value =>
  _.isNil(value) || (_.isString(value) && _.isEmpty(value))
    ? undefined
    : _.toNumber(value)

let rangeFilter = (field, min, max) => ({
  range: {
    [field]: _.pickBy(_.isNumber, {
      gte: boundaryFilter(min),
      lte: boundaryFilter(max),
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
