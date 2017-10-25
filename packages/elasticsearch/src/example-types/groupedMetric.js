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
//       data: {}
//     },
//     {
//       type: 'date_histogram',
//       field: 'PO.IssuedDate',
//       data: {
//         interval: 'month'
//       }
//     }
//   ]
// }

module.exports = {
  validContext: context =>
    context.config.metric.type &&
    !!(
      /value_count|top_hits/.test(context.config.metric.type) ||
      context.config.metric.field
    ),
  result: (context, search) =>
    search(
      _.reduce(
        (r, agg) => ({
          aggs: {
            [agg.key || 'child']: _.extend(
              {
                [agg.type]: _.extend(
                  agg.type == 'top_hits'
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
      )([context.config.metric].concat(_.reverse(context.config.aggs)))
    ).then(results => ({
      results: results.aggregations,
    })),
}
