let _ = require('lodash/fp')

module.exports = {
  validContext: node => node.field && node.values,
  result: ({ field, values, keyed = false }, search) =>
    search({
      aggs: {
        percentile_ranks: {
          percentile_ranks: {
            field,
            keyed,
            values
          }
        },
      },
    }).then(response => ({
      percentileRanks: response.aggregations.percentile_ranks,
    })),
}
