import _ from 'lodash/fp.js'
import stats from './statistical.js'
import { calcSmartInterval } from '../../utils/smartInterval.js'

export default {
  validContext: (node) => node.field,
  async result({ key, field, interval }, search) {
    if (!interval) {
      let { min, max } = await stats.result({ key, field }, search)
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
        (bucket) => ({
          key: bucket.key,
          count: bucket.doc_count,
        }),
        results.aggregations.histogram.buckets
      ),
    }
  },
}
