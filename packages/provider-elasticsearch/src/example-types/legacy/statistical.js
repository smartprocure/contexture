module.exports = {
  validContext: node => node.field,
  result: ({ field }, search) =>
    search({ aggs: { statistical: { stats: { field } } } }).then(
      results => results.aggregations.statistical
    ),
}
