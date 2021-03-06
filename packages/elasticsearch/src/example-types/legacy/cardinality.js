let { getField } = require('../../utils/fields')

module.exports = {
  validContext: node => node.field,
  result: ({ field }, search, schema) =>
    search({
      aggs: {
        cardinality: { cardinality: { field: getField(schema, field) } },
      },
    }).then(results => results.aggregations.cardinality),
}
