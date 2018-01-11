let _ = require('lodash/fp')

module.exports = {
  validContext: context => context.field && context.config.values,
  result: (context, search) =>
    search({
      aggs: {
        agg_percentileRanks: {
          percentile_ranks: _.extend(
            {
              field: context.field,
              keyed: context.keyed || false,
            },
            _.get('values', context) ? { values: context.values } : {}
          ),
        },
      },
    }).then(response => ({
      percentileRanks: _.get('aggregations.agg_percentileRanks', response),
    })),
}
