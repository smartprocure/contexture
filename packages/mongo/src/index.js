// var _ = require('lodash/fp')
var Promise = require('bluebird')

// Basic function to encapsulate everything needed to run a request - tiny wrapper over raw mongo syntax
var mongoDSL = (client, dsl) => {
  // if (!_.get(`collections.${dsl.collection}`, client))
  //   console.log('missing collection', await client.collections())
  //   throw `Collection [${dsl.collection}] does not exist in the client's db!`
  var Collection = client.collection(dsl.collection)
  // if (dsl.resultOptions)
  //     return Collection.find(dsl.criteria, dsl.resultOptions)
  // if (dsl.count)
  //     return Collection.count(dsl.criteria)
  if (dsl.aggs) return Collection.aggregate(dsl.aggs).toArray()
}

var MongoProvider = config => ({
  groupCombinator: (group, filters) => ({
    [`$${group.join === 'not' ? 'nor' : group.join}`]: filters,
  }),
  types: config.types,
  runSearch(options, context, schema, filters, aggs) {
    var client = config.getClient()

    var request = {
      // criteria: filters,
      collection: schema.mongo.collection,
      aggs: [
        {
          $match: filters || {},
        },
        ...aggs,
      ],
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
