var Promise = require('bluebird')

// Basic function to encapsulate everything needed to run a request - tiny wrapper over raw mongo syntax
var mongoDSL = (client, dsl) => {
  var Model = client.collection(dsl.model)

  // if (dsl.resultOptions)
  //     return Model.find(dsl.criteria, dsl.resultOptions)
  // if (dsl.count)
  //     return Model.count(dsl.criteria)

  if (dsl.aggs) return Model.aggregate(dsl.aggs).toArray()
}

var MongoProvider = config => ({
  groupCombinator: (group, filters) => ({
    [`$${group.join == 'not' ? 'nor' : group.join}`]: filters,
  }),
  types: config.types,
  runSearch: (options, context, schema, filters, aggs) => {
    var client = config.getClient()

    var request = {
      // criteria: filters,
      model: schema.mongo.model,
      aggs: [
        {
          $match: filters || {},
          //}].concat(aggs)
        },
        ...aggs
      ]
    }

    // Log Request
    context._meta.requests.push(request)

    var result = Promise.resolve(mongoDSL(client, request))
    return result.tap(results => {
      // Log response
      request.response = results
    })
  },
})

module.exports = MongoProvider
