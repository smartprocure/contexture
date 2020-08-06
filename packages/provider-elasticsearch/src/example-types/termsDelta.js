let _ = require('lodash/fp')
let aggUtils = require('../aggUtils')

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

let rawFieldName = _.pipe(
  _.replace('.untouched', ''),
  _.replace('.shingle', '')
)
let modeMap = {
  word: {
    suffix: '',
  },
  autocomplete: {
    suffix: '.untouched',
  },
  suggest: {
    suffix: '.shingle',
  },
}

let getFieldMode = ({ field, fieldMode }) =>
  rawFieldName(field) + modeMap[fieldMode || 'autocomplete'].suffix

module.exports = {
  validContext: () => true,
  result: async (node, search) => {
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
                [node.isScript ? 'script' : 'field']: getFieldMode(node),
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
  }
}
