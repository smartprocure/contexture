let _ = require('lodash/fp')

// Org -> Month -> $
// let example = {
//   metric: {
//     type: 'sum',
//     field: 'PO.IssuedAmount'
//   },
//   aggs: [
//     {
//       type: 'terms',
//       field: 'Organization.NameState.untouched',
//     },
//     {
//       type: 'date_histogram',
//       field: 'PO.IssuedDate',
//       interval: 'month'
//     }
//   ]
// }

module.exports = {
  validContext: context =>
    context.metric.type &&
    !!(
      /value_count|top_hits/.test(context.metric.type) || context.metric.field
    ),
  result: (context, search) =>
    search(
      _.reduce(
        (r, agg) => ({
          aggs: {
            [agg.key || 'child']: _.extend(
              {
                [agg.type]: _.extend(
                  agg.type === 'top_hits'
                    ? {}
                    : {
                        field: agg.field,
                      },
                  agg.data
                ),
              },
              r
            ),
          },
        }),
        {}
      )([context.metric].concat(_.reverse(context.aggs)))
    ).then(results => ({
      results: results.aggregations,
    })),
}
