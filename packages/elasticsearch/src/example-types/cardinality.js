let { getField } = require('../fields')

module.exports = {
  result: (context, search, schema) =>
    search({
      aggs: {
        cardinality: {
          cardinality: {
            // fieldMode defaults to 'word' for backwards compatibility
            field: getField(schema, context.field || context.config.field, context.fieldMode || 'word'),
          },
        },
      },
    }).then(results => results.aggregations.cardinality),
}
