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

let getFieldMode = config =>
  rawFieldName(config.field) +
  modeMap[config.fieldMode || 'autocomplete'].suffix

module.exports = {
  validContext: () => true,
  result: (context, search) =>
    search({
      aggs: {
        results: {
          filters: {
            filters: {
              background: aggUtils.buildFilter(context.aggs[0]),
              foreground: aggUtils.buildFilter(context.aggs[1]),
            },
          },
          aggs: {
            field: {
              terms: {
                [context.isScript ? 'script' : 'field']: getFieldMode(context),
                size: context.size || 50000, // Arbitrary value instead integer max value.
              },
            },
          },
        },
      },
    }).then(function(response) {
      let buckets = _.mapValues(
        ground => _.map('key', ground.field.buckets),
        response.aggregations.results.buckets
      )
      let diff = _.difference(buckets.foreground, buckets.background)
      return {
        results: context.isJsonString ? _.map(JSON.parse, diff) : diff,
        totalRecords: diff.length,
      }
    }),
}
