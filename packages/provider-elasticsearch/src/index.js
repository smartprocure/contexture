let _ = require('lodash/fp')
let Promise = require('bluebird')
let deterministic_stringify = require('json-stable-stringify')
let { getESSchemas } = require('./schema')

let ElasticsearchProvider = (
  config = {
    request: {},
  }
) => ({
  types: config.types,
  groupCombinator(group, filters) {
    let join = {
      and: 'must',
      or: 'should',
      not: 'must_not',
    }[group.join || 'and']

    let result = {
      bool: {
        [join]: filters,
      },
    }
    if (join === 'should') result.bool.minimum_should_match = 1

    return result
  },
  runSearch(options = {}, context, schema, filters, aggs) {
    let query = filters

    // Wrapping any query NOT sorted by _score in a constant_score,
    // so that it returns a constant score equal to the query boost
    // for every document in the filter.
    // Filter clauses are executed in filter context, meaning that scoring
    // is ignored and clauses are considered for caching.
    if (query && !_.has('sort._score', aggs))
      query = {
        constant_score: {
          filter: query,
        },
      }

    // Could nestify aggs here generically based on schema
    let request = {
      body: _.extend({ query }, aggs),
    }
    // If there are aggs, skip search results
    if (aggs.aggs) request.body.size = 0

    // Additional config for ES searches
    request = _.defaultsAll([
      {
        type: schema.elasticsearch.type,
        index: schema.elasticsearch.index,

        // Scroll Support
        scroll: context.scroll === true ? '2m' : context.scroll,
        // searchType:         context.searchType
      },
      config.request,
      request,
    ])

    request.headers = _.defaults(request.headers, options.requestorContext)

    // Deterministic ordering of JSON keys for request cache optimization
    request = JSON.parse(deterministic_stringify(request))

    // Log Request
    context._meta.requests.push({
      request,
    })

    // Required for scroll since 2.1.0 ES
    if (context.scroll) {
      request.body.sort = ['_doc']
      request.size = context.size
    }
    // Run Search
    let scrollId = context.scrollId
    let client = config.getClient()
    // If we have scrollId then keep scrolling if not search
    let result = scrollId
      ? client.scroll({
          scroll: context.scroll === true ? '2m' : context.scroll,
          scrollId,
        })
      : client.search(request)
    return Promise.resolve(result).tap(results => {
      if (results.timed_out) context.timedout = true
      // Log response
      _.last(context._meta.requests).response = results
    }).catch(({message, body}) => {
      throw {
        message,
        ..._.get('error.caused_by', body)
      }
    })
  },
  // Utility function to get a mapping used for building a schema directly from ES
  async getMappingProperties(schema) {
    let client = config.getClient()
    let { type, index } = schema.elasticsearch
    let mapping = await client.indices.getMapping({ index, type })

    for (let key in mapping) {
      return _.get([key, 'mappings', type, 'properties'], mapping)
    }
  },
  getSchemas: () => getESSchemas(config.getClient()),
})

module.exports = ElasticsearchProvider
