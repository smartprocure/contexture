let _ = require('lodash/fp')

let processReducers = (results, reducers) => {
  let handlers = {
    peakBy: (currentConfig, currentResults) =>
      _.map(result => {
        let peak = _.maxBy(currentConfig.field)(result.terms.buckets)
        return _.extend(peak, {
          id: result.key,
          peakKey: Number(peak.key),
        })
      })(currentResults),
    filter(config, currentResults) {
      let filteredResults = []
      let hasFieldPlus = _.curry(
        (currentConfig, other) =>
          _.has(other, currentConfig) && _.has('field', currentConfig)
      )(config)
      let operation = _.curry(
        (op, item) =>
          _.isNumber(config[op])
            ? _[op](_.get(config.field, item), config[op])
            : true
      )
      let filter = _.flow(operation, _.filter)

      if (hasFieldPlus('value'))
        filteredResults = _.filter({ [config.field]: config.value })(
          currentResults
        )
      else
        filteredResults = filter(
          _.find(hasFieldPlus, ['lt', 'lte', 'gt', 'gte', 'eq'])
        )(currentResults)

      return filteredResults
    },
    orderBy: (config, currentResults) =>
      _.has('field', config)
        ? _.orderBy(config.field, config.order || 'asc', currentResults)
        : currentResults,
  }

  let pipeline = []
  _.each(reducer => {
    if (handlers[reducer.type])
      pipeline.push(_.curry(handlers[reducer.type])(reducer.config))
  })(reducers)

  return _.pipe(...pipeline)(results)
}

let getInnerMost = result => {
  if (!result.aggs) return result
  return getInnerMost(result.aggs[_.keys(result.aggs)[0]])
}
module.exports = {
  validContext: () => true,
  result(context, search) {
    let body = _.reduce((r, agg) => {
      getInnerMost(r).aggs = {
        [agg.type]: {
          [agg.type]: _.extend(
            {
              field: agg.field,
            },
            agg.data
          ),
        },
      }
      return r
    }, {})(context.config.aggs)
    return search(body).then(results => {
      let buckets =
        results.aggregations[_.keys(results.aggregations)[0]].buckets

      if (context.config.reducers) {
        let reducedResults = processReducers(
          buckets,
          context.config.reducers,
          context.config
        )

        if (context.config.page) {
          let offset = (context.config.page - 1) * context.config.pageSize
          return {
            results: _.drop(offset)(reducedResults).slice(
              0,
              context.config.pageSize
            ),
            totalRecords: reducedResults.length,
          }
        }

        return {
          results: reducedResults,
          totalRecords: reducedResults.length,
        }
      }

      return {
        results: buckets,
      }
    })
  },
}
