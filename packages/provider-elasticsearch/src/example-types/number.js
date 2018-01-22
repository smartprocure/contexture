let _ = require('lodash/fp')

/*
 1. An empty value as the upper boundary represents infinity.
 2. An empty value as the lower boundary represents negative infinity.
 3. Zero has to be respected as a boundary value.
*/
let boundaryFilter = value => {
  if (_.isString(value) && _.isEmpty(value)) value = NaN
  return _.isNaN(_.toNumber(value)) ? null : _.toNumber(value)
}

module.exports = {
  hasValue: context => context.min || context.max,
  filter: context => ({
    range: {
      [context.field]: _.pickBy(_.isNumber, {
        gte: boundaryFilter(context.min),
        lte: boundaryFilter(context.max),
      }),
    },
  }),
  async result(context, search) {
    let field = _.get('field', context)
    let result = await search({
      aggs: {
        statistical: {
          stats: {
            field,
            missing: 0,
          },
        },
      },
    })

    let statistical = _.get('aggregations.statistical', result)
    let interval =
      Math.round(Math.abs(statistical.max - statistical.min) / 50) || 1
    let histogram = []

    if (interval) {
      let valuesResult = await search({
        aggs: {
          values: {
            histogram: {
              field,
              interval,
<<<<<<< HEAD
              min_doc_count: 0
            }
          }
=======
              min_doc_count: 0,
            },
          },
>>>>>>> 7eb8ce0727a824cad0d6210514f7b6a0bde4af67
        },
      })

      let totalDocuments = _.get('hits.total', valuesResult)
      histogram = _.map(
        entry => ({
          value: Math.round(entry.key),
          count: entry.doc_count,
        }),
        _.get('aggregations.values.buckets', valuesResult)
      )
    }

    return {
      results: {
        interval,
        statistical,
        histogram,
      },
    }
  },
}
