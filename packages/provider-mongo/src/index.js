let Promise = require('bluebird')
let debugRequest = require('debug')('contexture:mongo:request')
let debugResponse = require('debug')('contexture:mongo:response')

// Basic function to encapsulate everything needed to run a request - tiny wrapper over raw mongo syntax
let mongoDSL = (client, dsl) => {
  debugRequest('Collection: %s. Aggregation: %O', dsl.collection, dsl.aggs)
  let Collection = client.collection(dsl.collection)
  if (dsl.aggs) return Collection.aggregate(dsl.aggs).toArray()
}

let MongoProvider = (config) => ({
  groupCombinator: (group, filters) => ({
    [`$${group.join === 'not' ? 'nor' : group.join}`]: filters,
  }),
  types: config.types,
  runSearch(options, node, schema, filters, aggs) {
    let client = config.getClient()

    let request = {
      request: {
        // criteria: filters,
        collection: schema.mongo.collection,
        aggs: [
          {
            $match: filters || {},
          },
          ...aggs,
        ],
      },
    }

    // Log Request
    node._meta.requests.push(request)

    let result = Promise.resolve(mongoDSL(client, request.request))
    return result.tap((results) => {
      debugResponse('%O', results)
      // Log response
      request.response = results
    })
  },
})

module.exports = MongoProvider
