let _ = require('lodash/fp')
let percentiles = require('./percentiles').result

module.exports = {
  validContext: context => context.field,
  result(context, search) {
    let keyField = _.get('field', context)
    let percentsArray = _.get('percents', context)
    return percentiles(context, search).then(percentilesResult => {
      let percentilesArray = _.get('percentiles.values', percentilesResult)
      let ranges = []
      _.each(range => {
        let index = _.indexOf(range, percentsArray)
        let percentileObj = _.find({ key: range }, percentilesArray)
        if (index === 0) return ranges.push({ to: percentileObj.value })
        else {
          ranges.push({
            from: _.last(ranges).to,
            to: percentileObj.value,
          })
          if (index === percentsArray.length - 1)
            ranges.push({ from: percentileObj.value })
          else
            ranges.push({
              from: percentileObj.value,
              to: percentilesArray[index + 1].value,
            })
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
          percentilesRange: buckets,
        }
      })
    })
  },
}
