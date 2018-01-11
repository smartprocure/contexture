let _ = require('lodash/fp')
let F = require('futil-js')

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
  validContext: context =>
    context.key_field &&
    context.key_type &&
    context.value_field &&
    context.value_type,
  result(context, search) {
    let query = {
      aggs: {
        twoLevelAgg: {
          [context.key_type]: _.omitBy(
            _.isNil,
            _.extend(
              {
                field: context.key_field,
              },
              context.key_data
            )
          ),
          aggs: {
            twoLevelAgg: {
              [context.value_type]: _.omitBy(
                _.isNil,
                _.extend(
                  {
                    field: context.value_field,
                  },
                  context.value_data
                )
              ),
            },
          },
        },
      },
    }
    _.each(agg => {
      query.aggs[agg.key] = agg.config.data
    }, context.extraAggs)

    if (context.filter_agg)
      query = {
        aggs: {
          twoLevelFilter: _.extend(
            {
              filter: context.filter_agg,
            },
            query
          ),
        },
      }

    return search(query).then(results => {
      let rtn = {
        results: F.mapIndexed(
          (bucket, key) =>
            _.extend(
              {
                // Generally bucket.key works, but for twoLevelMatch it needed to be key because buckets is an object and not an array
                key: bucket.key || key,
                doc_count: bucket.doc_count,
              },
              bucket.twoLevelAgg
            ),
          (results.aggregations.twoLevelFilter || results.aggregations)
            .twoLevelAgg.buckets
        ),
      }
      if (context.extraAggs) {
        _.each(agg => {
          rtn[agg.key] = results.aggregations[agg.key][agg.config.value_field]
        }, context.extraAggs)
      }
      return rtn
    })
  },
}
