let _ = require('lodash/fp')

module.exports = {
  validContext: context => context.config.field && context.config.values,
  result: (context, search, schema, provider, options) =>
    search({
      aggs: {
        agg_percentileRanks: {
          percentile_ranks: _.extend(
            {
              field: context.config.field,
              keyed: context.config.keyed || false
            },
            _.get('config.values', context)
              ? {values: context.config.values}
              : {}
          )
        }
      }
    }).then(response => ({
      percentileRanks: _.get('aggregations.agg_percentileRanks', response)
    }))
}
