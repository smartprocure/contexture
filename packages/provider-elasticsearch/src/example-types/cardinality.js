let { getField } = require('../fields')

module.exports = {
  result(node, search, schema) {
    let field = node.field || node.config.field
    return search({
      aggs: {
        cardinality: {
          cardinality: {
            // fieldMode defaults to 'word' for backwards compatibility
            field: node.fieldMode
              ? getField(schema, field, node.fieldMode)
              : field,
          },
        },
      },
    }).then(results => results.aggregations.cardinality)
  },
}
