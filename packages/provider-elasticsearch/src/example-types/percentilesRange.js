let _ = require('lodash/fp')
let percentiles = require('./percentiles').result

module.exports = {
  validContext: context => context.config.field,
  result(context, search) {
    let keyField = _.get('config.field', context)
    let percentsArray = _.get('config.percents', context)
    return percentiles(context, search).then(percentilesResult => {
      let percentilesArray = _.get('percentiles.values', percentilesResult)
      let ranges = _.map(range => {
        let index = _.indexOf(range, percentsArray)
        let percentileObj = _.find({ key: range }, percentilesArray)
        if (index === 0) return { to: percentileObj.value }
        if (index === percentsArray.length - 1)
          return { from: percentileObj.value }
        else {
          return {
            from: percentileObj.value,
            to: percentilesArray[index + 1].value,
          }
        }
      }, percentsArray)
      return search({
        aggs: {
          price_ranges: {
            range: {
              field: keyField,
              ranges,
            },
          },
        },
      }).then(result => {
        let buckets = _.get('aggregations.price_ranges.buckets', result)
        return {
          percentilesRange: _.map(
            range =>
              _.extend(
                { percent: range },
                buckets[_.indexOf(range, percentsArray)]
              ),
            percentsArray
          ),
        }
      })
    })
  },
}
