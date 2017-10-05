let _ = require('lodash/fp')
let aggUtils = require('../aggUtils')

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
              background: aggUtils.buildFilter(context.config.aggs[0]),
              foreground: aggUtils.buildFilter(context.config.aggs[1]),
            },
          },
          aggs: {
            field: {
              terms: {
                [context.config.isScript ? 'script' : 'field']: getFieldMode(
                  context.config
                ),
                size: context.config.size || 50000, // Arbitrary value instead integer max value.
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
        results: context.config.isJsonString ? _.map(JSON.parse, diff) : diff,
        totalRecords: diff.length,
      }
    }),
}
