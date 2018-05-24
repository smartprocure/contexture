let _ = require('lodash/fp')
let Promise = require('bluebird')
let statsResults = require('./statistical').result
let calcSmartInterval = require('../smartInterval').calcSmartInterval

module.exports = {
  validContext: context => context.field,
  result(context, search) {
    let field = context.field
    let interval = context.interval
    if (!interval) {
      interval = statsResults(
        {
          key: context.key,
          field,
        },
        search
      ).then(statResult => calcSmartInterval(statResult.min, statResult.max))
    }

    return Promise.resolve(interval).then(intervalResult =>
      search({
        aggs: {
          histogram: {
            histogram: {
              field,
              interval: intervalResult,
              min_doc_count: 0,
            }, // ,
            // aggs: {
            //   histogram: {
            //     stats: {
            //       field: context.value_field
            //     }
            //   }
            // }
          },
        },
      }).then(results => ({
        interval: intervalResult,
        entries: _.map(
          bucket =>
            //_.extend
            ({
              key: bucket.key,
              count: bucket.doc_count,
            }), //,
          //{} /* bucket.histogram */
          results.aggregations.histogram.buckets
        ),
      }))
    )
  },
}
