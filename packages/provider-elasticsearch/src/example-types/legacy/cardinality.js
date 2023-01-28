import { getField } from '../../utils/fields.js'

export default {
  validContext: node => node.field,
  result: ({ field }, search, schema) =>
    search({
      aggs: {
        cardinality: { cardinality: { field: getField(schema, field) } },
      },
    }).then(results => results.aggregations.cardinality),
}
