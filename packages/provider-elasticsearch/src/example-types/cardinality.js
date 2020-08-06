let { getField } = require('../fields')

module.exports = {
  result: ({ field, fieldMode }, search, schema) =>
    search({
      aggs: {
        cardinality: {
          cardinality: {
            // fieldMode defaults to 'word' for backwards compatibility
            field: fieldMode ? getField(schema, field, fieldMode) : field,
          },
        },
      },
    }).then(results => results.aggregations.cardinality),
}
