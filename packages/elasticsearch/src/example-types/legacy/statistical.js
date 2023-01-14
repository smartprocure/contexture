export let validContext = node => node.field

export let result = ({ field }, search) =>
  search({ aggs: { statistical: { stats: { field } } } }).then(
    results => results.aggregations.statistical
  )
