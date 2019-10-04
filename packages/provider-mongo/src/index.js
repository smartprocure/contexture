let Promise = require('bluebird')

// Basic function to encapsulate everything needed to run a request - tiny wrapper over raw mongo syntax
let mongoDSL = (client, dsl) => {
  let Collection = client.collection(dsl.collection)
  if (dsl.aggs) return Collection.aggregate(dsl.aggs).toArray()
}

let MongoProvider = config => ({
  groupCombinator: (group, filters) => ({
    [`$${group.join === 'not' ? 'nor' : group.join}`]: filters,
  }),
  types: config.types,
  runSearch(options, node, schema, filters, aggs) {
    let client = config.getClient()

    let request = {
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
    node._meta.requests.push(request)

    let result = Promise.resolve(mongoDSL(client, request))
    return result.tap(results => {
      // Log response
      request.response = results
    })
  },
})

module.exports = MongoProvider
