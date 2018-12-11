let { getField } = require('../fields')

module.exports = {
  result(context, search, schema) {
    let field = context.field || context.config.field
    return search({
      aggs: {
        cardinality: {
          cardinality: {
            // fieldMode defaults to 'word' for backwards compatibility
            field: context.fieldMode
              ? getField(schema, field, context.fieldMode)
              : field,
          },
        },
      },
    }).then(results => results.aggregations.cardinality)
  },
}
