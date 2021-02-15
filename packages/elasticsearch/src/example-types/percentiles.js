let F = require('futil')
let _ = require('lodash/fp')

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
