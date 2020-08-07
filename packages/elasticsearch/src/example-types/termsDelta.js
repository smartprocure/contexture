let _ = require('lodash/fp')
let aggUtils = require('../aggUtils')
let { getField } = require('../fields')

// let example = {
//   field: 'Organization.NameState.untouched',
//   background: {
//     type: 'range',
//     field: 'PO.IssuedDate',
//     data: {
//       gte: 'now-1y-90d',
//       lte: 'now-90d',
//       format: 'dateOptionalTime'
//     }
//   },
//   foreground: {
//     type: 'range',
//     field: 'PO.IssuedDate',
//     data: {
//       gte: 'now-90d',
//       lte: 'now',
//       format: 'dateOptionalTime'
//     }
//   }
// }

module.exports = {
  validContext: () => true,
  async result(node, search, schema) {
    let response = await search({
      aggs: {
        results: {
          filters: {
            filters: {
              background: aggUtils.buildFilter(node.aggs[0]),
              foreground: aggUtils.buildFilter(node.aggs[1]),
            },
          },
          aggs: {
            field: {
              terms: {
                [node.isScript ? 'script' : 'field']: getField(
                  schema,
                  node.field
                ),
                size: node.size || 50000, // Arbitrary value instead integer max value.
              },
            },
          },
        },
      },
    })
    let buckets = _.mapValues(
      ground => _.map('key', ground.field.buckets),
      response.aggregations.results.buckets
    )
    let diff = _.difference(buckets.foreground, buckets.background)
    return {
      results: node.isJsonString ? _.map(JSON.parse, diff) : diff,
      totalRecords: diff.length,
    }
  },
}
