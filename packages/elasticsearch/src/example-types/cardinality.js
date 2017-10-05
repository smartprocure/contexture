module.exports = {
  result: (context, search) =>
    search({
      aggs: {
        cardinality: {
          cardinality: {
            field: context.field || context.config.field
          }
        }
      }
    }).then(results => results.aggregations.cardinality)
}
