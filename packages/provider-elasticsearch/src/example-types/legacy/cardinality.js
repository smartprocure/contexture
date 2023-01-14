import { getField } from '../../utils/fields.js'

export let validContext = node => node.field

export let result = ({ field }, search, schema) =>
  search({
    aggs: {
      cardinality: { cardinality: { field: getField(schema, field) } },
    },
  }).then(results => results.aggregations.cardinality)
