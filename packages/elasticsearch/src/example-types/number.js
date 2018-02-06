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

module.exports = {
  hasValue: context => _.isNumber(context.min) || _.isNumber(context.max),
  filter: ({ field, min, max }) => rangeFilter(field, min, max),
  async result({ field, min, max, percentileInterval = 1 }, search) {
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

    let interval =
      Math.round(Math.abs(statistical.max - statistical.min) / 40) || 1
    let histogram = []

    if (interval) {
      let histogramResult = await search({
        aggs: {
          range_filter: {
            filter: rangeFilter(field, min, max),
            aggs: {
              values: {
                histogram: {
                  field,
                  interval,
                  min_doc_count: 0,
                },
              },
            },
          },
        },
      })

      histogram = _.map(
        entry => ({
          value: Math.round(entry.key),
          count: entry.doc_count,
        }),
        _.get('aggregations.range_filter.values.buckets', histogramResult)
      )
    }

    return {
      results: {
        interval,
        statistical,
        histogram,
        percentiles,
      },
    }
  },
}
