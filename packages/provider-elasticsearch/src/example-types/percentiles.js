module.exports = {
  validContext: node => node.field,
  result: ({ field, percents, keyed = false }, search) =>
    search({
      aggs: {
        percentiles: {
          percentiles: {
            field,
            keyed,
            ...(percents && { percents }),
          },
        },
      },
    }).then(response => ({
      percentiles: response.aggregations.percentiles,
    })),
}
