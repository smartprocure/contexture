let _ = require('lodash/fp')
let F = require('futil')
let metrics = [
  'avg',
  'max',
  'min',
  'sum',
  'value_count',
  'weighted_avg',
  'cardinality',
  'median_absolute_deviation',
]
let hasValidMetrics = node => !_.difference(node.include, metrics).length

// let example = {
//   key_type: 'range',
//   key_field: '',
//   key_data: {
//     ranges: []
//   },
//   value_type: 'stats',
//   value_field: '',
//   value_data: {}
// }
module.exports = {
  validContext: node =>
    node.key_field && node.key_type && node.value_field && node.value_type,
  result(node, search) {
    // 'count' as alias for `value_count'
    node.include = F.replaceElement('count', 'value_count', node.include)
    let validMetrics = hasValidMetrics(node)
    if (!validMetrics)
      throw new Error(
        `Unsupported include options ${_.difference(metrics, node.include)}`
      )
    let query = {
      aggs: {
        twoLevelAgg: {
          [node.key_type]: F.omitNil({
            field: node.key_field,
            ...node.key_data,
          }),
          aggs: F.arrayToObject(
            _.identity,
            metric => ({
              [metric]: {
                field: node.value_field,
                ...F.omitNil(node.value_data),
              },
            }),
            _.size(node.include) ? node.include : [node.value_type]
          ),
        },
      },
    }

    if (node.filter_agg)
      query = {
        aggs: {
          twoLevelFilter: {
            filter: node.filter_agg,
            ...query,
          },
        },
      }
    return search(query).then(results => {
      let rtn = {
        results: F.mapIndexed(
          (bucket, key) =>
            _.extend(
              {
                // Generally bucket.key works, but for twoLevelMatch it needed
                // to be key because buckets is an object and not an array
                key: bucket.key || key,
                doc_count: bucket.doc_count,
              },
              // If any one of the metrics in our bucket has a nil value, we
              // pull that out instead of returning the whole bucket
              _.find(
                x => _.isObject(x) && _.isNil(x.value) && _.isNil(x.values),
                bucket
              ) ||
                _.flow(
                  F.renameProperty('value_count', 'count'),
                  _.mapValues(F.getOrReturn('value'))
                )(bucket)
            ),
          (results.aggregations.twoLevelFilter || results.aggregations)
            .twoLevelAgg.buckets
        ),
      }
      return rtn
    })
  },
}
