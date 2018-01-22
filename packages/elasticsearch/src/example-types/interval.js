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
      })
    }
  }),
  result: async (context, search) => {
    let field = _.get('field', context)
    let result = await search({
      aggs: {
        statistical: {
          stats: {
            field,
            missing: 0,
          },
        }
      },
    })

    let statistical = _.get('aggregations.statistical', result)
    let interval = Math.round(Math.abs(statistical.max - statistical.min) / 50) || 1
    let histogram = []

    if (interval) {
      let pricesResult = await search({
        aggs: {
          prices: {
            histogram: {
              field,
              interval: interval,
              min_doc_count: 0,
              offset: statistical.min
            }
          }
        },
      })

      let totalDocuments = _.get('hits.total', pricesResult)
      histogram = _.map(entry => {
        let percent = Math.round(totalDocuments ? (100 * (entry.doc_count / totalDocuments)) : 0)
        return {
          price: Math.round(entry.key),
          count: entry.doc_count,
          percent: (percent > 1 ? percent : 2)
        }
      }, _.get('aggregations.prices.buckets', pricesResult))
    }

    return {
      results: {
        interval,
        statistical,
        histogram
      }
    }
  }
}
