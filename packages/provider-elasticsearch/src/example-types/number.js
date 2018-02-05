let _ = require('lodash/fp')

/*
 1. An empty value as the upper boundary represents infinity.
 2. An empty value as the lower boundary represents negative infinity.
 3. Zero has to be respected as a boundary value.
*/
let boundaryFilter = value => {
  if (_.isString(value) && _.isEmpty(value)) value = NaN
  return _.isNaN(_.toNumber(value)) ? null : _.toNumber(value)
}

module.exports = {
  hasValue: context => _.isNumber(context.min) || _.isNumber(context.max),
  filter: context => ({
    range: {
      [context.field]: _.pickBy(_.isNumber, {
        gte: boundaryFilter(context.min),
        lte: boundaryFilter(context.max),
      }),
    },
  }),
  async result({ field, min, max }, search) {
    let rangeFilter = {
      range: {
        [field]: _.pickBy(_.isNumber, {
          gte: boundaryFilter(min),
          lte: boundaryFilter(max),
        })
      }
    }

    let statisticalResult = await search({
      aggs: {
        range_filter: {
          filter: rangeFilter,
          aggs: {
            statistical: {
              extended_stats: {
                field,
                missing: 0,
                sigma: 1,
              },
            },
          }
        },
      },
    })

    let percentilesResult = await search({
      aggs: {
        range_filter: {
          filter: rangeFilter,
          aggs: {
            all_percentiles: {
              percentiles: {
                field,
                percents: [0, 0.5, 99.5, 100]
              },
            },
          },
        },
      },
    })

    let percentiles = _.get('aggregations.range_filter.all_percentiles.values', percentilesResult)
    let statistical = _.get('aggregations.range_filter.statistical', statisticalResult)

    let interval =
      Math.round(Math.abs(statistical.max - statistical.min) / 40) || 1
    let histogram = []

    if (interval) {
      let histogramResult = await search({
        aggs: {
          range_filter: {
            filter: rangeFilter,
            aggs: {
              values: {
                histogram: {
                  field,
                  interval,
                  min_doc_count: 0,
                },
              },
            }
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
