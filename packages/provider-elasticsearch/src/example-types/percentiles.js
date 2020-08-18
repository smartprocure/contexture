let _ = require('lodash/fp')

module.exports = {
  validContext: node => node.field,
  result: (node, search) =>
    search({
      aggs: {
        percentiles: {
          percentiles: _.pick(['field', 'percents', 'keyed'], node),
        },
      },
    }).then(response => ({
      percentiles: response.aggregations.percentiles,
    })),
}
