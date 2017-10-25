let _ = require('lodash/fp')

module.exports = {
  validContext: context => context.config.field,
  result: (context, search) =>
    search({
      aggs: {
        agg_percentiles: {
          percentiles: _.extend(
            {
              field: context.config.field,
              keyed: context.config.keyed || false,
            },
            _.get('config.percents', context)
              ? { percents: context.config.percents }
              : {}
          ),
        },
      },
    }).then(response => ({
      percentiles: _.get('aggregations.agg_percentiles', response),
    })),
}
