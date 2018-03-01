const _ = require('lodash/fp')
const util = require('./numberUtil')

module.exports = {
  hasValue: context => !_.isNil(context.min) || !_.isNil(context.max),
  filter: ({ field, min, max }) => util.rangeFilter(field, min, max),
  async result({ field, min, max, percentileInterval = 1 }, search) {
    let { statistical, percentiles } = await util.getStatisticalResults(
      search,
      field,
      min,
      max,
      percentileInterval
    )

    let interval =
      Math.round(Math.abs(statistical.max - statistical.min) / 40) || 1
    let histogram = []

    if (interval) {
      let histogramResult = await search({
        aggs: {
          range_filter: {
            filter: util.rangeFilter(field, min, max),
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
      interval,
      statistical,
      histogram,
      percentiles,
    }
  },
}
