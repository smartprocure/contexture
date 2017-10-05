let _ = require('lodash/fp')

module.exports = {
  validContext: context => context.config.field,
  result: (context, search, schema, provider, options) => {
    let keyField = _.get('config.field', context)
    let percentsArray = _.get('config.percents', context)
    return search({
      aggs: {
        statistical: {
          stats: {
            field: keyField,
            missing: 0
          }
        }
      }
    }).then(statsResults => {
      let {max} = statsResults.aggregations.statistical
      let ranges = _.map(range => {
        let index = _.indexOf(range, percentsArray)
        let val = max * (range / 100)
        if (index === 0) return {to: val}
        if (index === percentsArray.length - 1) return {from: val}
        else {
          return {
            from: val,
            to: max * (percentsArray[index + 1] / 100)
          }
        }
      }, percentsArray)
      return search({
        aggs: {
          price_ranges: {
            range: {
              field: keyField,
              ranges: ranges
            }
          }
        }
      }).then(percentileRanksResult => {
        let buckets = _.get(
          'aggregations.price_ranges.buckets',
          percentileRanksResult
        )
        return {
          percentileRanks: _.map(
            range =>
              _.extend(
                {percent: range},
                buckets[_.indexOf(range, percentsArray)]
              ),
            percentsArray
          )
        }
      })
    })
  }
}
