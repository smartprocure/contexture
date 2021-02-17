let _ = require('lodash/fp')
let statsResults = require('./statistical').result
let calcSmartInterval = require('../../utils/smartInterval').calcSmartInterval

module.exports = {
  validContext: node => node.field,
  async result({ key, field, interval }, search) {
    if (!interval) {
      let { min, max } = await statsResults({ key, field }, search)
      interval = calcSmartInterval(min, max)
    }
    let results = await search({
      aggs: {
        histogram: {
          histogram: {
            field,
            interval,
            min_doc_count: 0,
          },
        },
      },
    })
    return {
      interval,
      entries: _.map(
        bucket => ({
          key: bucket.key,
          count: bucket.doc_count,
        }),
        results.aggregations.histogram.buckets
      ),
    }
  },
}
