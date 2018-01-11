let _ = require('lodash/fp')

module.exports = {
  validContext: context => context.field,
  result: (context, search) =>
    search({
      aggs: {
        agg_percentiles: {
          percentiles: _.extend(
            {
              field: context.field,
              keyed: context.keyed || false,
            },
            _.get('percents', context) ? { percents: context.percents } : {}
          ),
        },
      },
    }).then(response => ({
      percentiles: _.get('aggregations.agg_percentiles', response),
    })),
}
