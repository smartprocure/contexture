let debug = require('debug')('contexture:mongo')

let revolvingCounter = max => {
  let counter = 0
  return {
    inc() {
      if (counter === max) {
        counter = 1
      } else {
        counter++
      }
      return counter
    },
  }
}
let counter = revolvingCounter(500)

// Basic function to encapsulate everything needed to run a request - tiny wrapper over raw mongo syntax
let mongoDSL = async (client, { collection, aggs }, count) => {
  let Collection = client.collection(collection)
  if (aggs) {
    debug('(%s) Collection: %s. Pipeline: %O', count, collection, aggs)
    let results = await Collection.aggregate(aggs).toArray()
    debug('(%s) Response: %O', count, results)
    return results
  }
}

let MongoProvider = config => ({
  groupCombinator: (group, filters) => ({
    [`$${group.join === 'not' ? 'nor' : group.join}`]: filters,
  }),
  types: config.types,
  async runSearch(options, node, schema, filters, aggs) {
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

    let results = await mongoDSL(client, request.request, counter.inc())
    // Log response
    request.response = results
    return results
  },
})

module.exports = MongoProvider
