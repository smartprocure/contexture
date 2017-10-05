let _ = require('lodash/fp'),
  Promise = require('bluebird'),
  statsResults = require('./statistical').result,
  calcSmartInterval = require('../smartInterval').calcSmartInterval

module.exports = {
  validContext: context => context.field || context.config.field,
  result: (context, search, schema, provider, options) => {
    let field = context.field || context.config.field
    let interval = context.config.interval
    if (!interval) {
      interval = statsResults(
        {
          key: context.key,
          field: field
        },
        search
      ).then(statResult => calcSmartInterval(statResult.min, statResult.max))
    }

    return Promise.resolve(interval).then(intervalResult =>
      search({
        aggs: {
          histogram: {
            histogram: {
              field: field,
              interval: intervalResult,
              min_doc_count: 0
            } // ,
            // aggs: {
            //   histogram: {
            //     stats: {
            //       field: context.config.value_field
            //     }
            //   }
            // }
          }
        }
      }).then(results => ({
        interval: intervalResult,
        entries: _.map(
          bucket =>
            //_.extend
            ({
              key: bucket.key,
              count: bucket.doc_count
            }), //,
          //{} /* bucket.histogram */
          results.aggregations.histogram.buckets
        )
      }))
    )
  }
}
