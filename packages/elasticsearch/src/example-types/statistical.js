let _ = require('lodash/fp')

module.exports = {
  result: (context, search) =>
    search({
      aggs: {
        statistical: {
          stats: {
            field: _.get('config.field', context) || context.field,
          },
        },
      },
    }).then(results => results.aggregations.statistical),
}
