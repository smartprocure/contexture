let { getField } = require('../fields')

module.exports = {
  result: ({ field }, search, schema) =>
    search({
      aggs: {
        cardinality: {
          cardinality: {
            field: getField(schema, field),
          },
        },
      },
    }).then(results => results.aggregations.cardinality),
}
