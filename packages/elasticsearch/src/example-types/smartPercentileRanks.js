let _ = require('lodash/fp')

module.exports = {
  validContext: node => node.field,
  async result({ field, percents }, search) {
    let statsResults = await search({
      aggs: {
        statistical: {
          stats: {
            field,
            missing: 0,
          },
        },
      },
    })
    let { max } = statsResults.aggregations.statistical
    let ranges = _.map(range => {
      let index = _.indexOf(range, percents)
      let val = max * (range / 100)
      if (index === 0) return { to: val }
      if (index === percents.length - 1) return { from: val }
      return { from: val, to: max * (percents[index + 1] / 100) }
    }, percents)
    let percentileRanksResult = await search({
      aggs: {
        price_ranges: {
          range: {
            field,
            ranges,
          },
        },
      },
    })
    let buckets = percentileRanksResult.aggregations.price_ranges.buckets
    return {
      percentileRanks: _.map(
        range => _.extend(
          { percent: range },
          buckets[_.indexOf(range, percents)]
        ),
        percents
      ),
    }    
  },
}
