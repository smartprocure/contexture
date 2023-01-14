import _ from 'lodash/fp.js'
import { result as statsResults } from './statistical.js'
import { calcSmartInterval } from '../../utils/smartInterval.js'

export let validContext = node => node.field

export let result = async ({ key, field, interval }, search) => {
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
}
