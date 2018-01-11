let _ = require('lodash/fp')

module.exports = {
  result: (context, search) =>
    search({
      aggs: {
        statistical: {
          stats: {
            field: context.field,
          },
        },
      },
    }).then(results => results.aggregations.statistical),
}
