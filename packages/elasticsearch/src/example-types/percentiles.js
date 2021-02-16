let F = require('futil')

module.exports = {
  validContext: node => node.field,
  result: ({ field, percents, keyed }, search) =>
    search({
      aggs: {
        percentiles: {
          percentiles: F.omitNil({ field, percents, keyed }),
        },
      },
    }).then(x => x.aggregations)
}
