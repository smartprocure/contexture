let _ = require('lodash/fp')
let percentiles = require('./percentiles').result

module.exports = {
  validContext: context => context.field,
  result(node, search) {
    let { field, percents } = node
    return percentiles(node, search).then(percentilesResult => {
      let percentilesArray = _.get('percentiles.values', percentilesResult)
      let ranges = []
      _.each(range => {
        let index = _.indexOf(range, percents)
        let percentileObj = _.find({ key: range }, percentilesArray)
        if (index === 0) return ranges.push({ to: percentileObj.value })
        else {
          ranges.push({
            from: _.last(ranges).to,
            to: percentileObj.value,
          })
          if (index === percents.length - 1)
            ranges.push({ from: percentileObj.value })
          else
            ranges.push({
              from: percentileObj.value,
              to: percentilesArray[index + 1].value,
            })
        }
      }, percents)
      return search({
        aggs: {
          price_ranges: {
            range: {
              field,
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
