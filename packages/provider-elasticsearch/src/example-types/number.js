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
        lte: boundaryFilter(context.max)
      })
    }
  }),
  async result({field, min, max, zoomIn}, search) {
    let rangeFilter = {
      range: {
        [field]: _.pickBy(_.isNumber, {
          gte: boundaryFilter(min),
          lte: boundaryFilter(max)
        })
      }
    }

    let baseStatistical = {
      statistical: {
        extended_stats: {
          field,
          missing: 0,
          sigma: 1
        }
      }
    }

    let statisticalResult

    if (zoomIn) {
      statisticalResult = await search({
        aggs: {
          range_filter: {
            filter: rangeFilter,
            aggs: baseStatistical
          }
        }
      })
    } else {
      statisticalResult = await search({
        aggs: baseStatistical
      })
    }

    let percentilesResult = await search({
      aggs: {
        range_filter: {
          filter: {
            range: {
              [field]: _.pickBy(_.isNumber, {
                gte: boundaryFilter(min),
                lte: boundaryFilter(max)
              })
            }
          },
          aggs: {
            all_percentiles: {
              percentiles: {
                field,
                percents: [0, 0.5, 99.5, 100]
              }
            }
          }
        }
      }
    })

    let percentiles = _.get(
      'aggregations.range_filter.all_percentiles.values',
      percentilesResult
    )
    let statistical = zoomIn
      ? _.get('aggregations.range_filter.statistical', statisticalResult)
      : _.get('aggregations.statistical', statisticalResult)

    let interval =
      Math.round(Math.abs(statistical.max - statistical.min) / 40) || 1
    let histogram = []

    if (interval) {
      let histogramBase = {
        values: {
          histogram: {
            field,
            interval,
            min_doc_count: 0
          }
        }
      }

      let histogramResult
      if (zoomIn) {
        histogramResult = await search({
          aggs: {
            range_filter: {
              filter: rangeFilter,
              aggs: histogramBase
            }
          }
        })
      } else {
        histogramResult = await search({
          aggs: histogramBase
        })
      }

      histogram = _.map(
        entry => ({
          value: Math.round(entry.key),
          count: entry.doc_count
        }),
        zoomIn
          ? _.get('aggregations.range_filter.values.buckets', histogramResult)
          : _.get('aggregations.values.buckets', histogramResult)
      )
    }

    return {
      results: {
        interval,
        statistical,
        histogram,
        percentiles
      }
    }
  }
}
