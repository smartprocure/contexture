let _ = require('lodash/fp')
let deterministic_stringify = require('json-stable-stringify')
let { getESSchemas } = require('./schema')

let constantScore = filter => ({ constant_score: { filter } })

// Deterministic ordering of JSON keys for request cache optimization
let stableKeys = x => JSON.parse(deterministic_stringify(x))

let ElasticsearchProvider = (config = { request: {} }) => ({
  types: config.types,
  groupCombinator(group, filters) {
    let join = {
      and: 'must',
      or: 'should',
      not: 'must_not',
    }[group.join || 'and']

    return {
      bool: {
        [join]: filters,
        ...(join === 'should' && { minimum_should_match: 1 }),
      },
    }
  },
  async runSearch({ requestorContext } = {}, node, schema, filters, aggs) {
    let { scroll, scrollId } = node
    let request = scrollId
      ? // If we have scrollId then keep scrolling, no query needed
        { scroll: scroll === true ? '2m' : scroll, scrollId }
      : // Deterministic ordering of JSON keys for request cache optimization
        stableKeys({
          index: schema.elasticsearch.index,
          // Scroll support (used for bulk export)
          ...(scroll && { scroll: scroll === true ? '2m' : scroll }),
          body: {
            // Wrap in constant_score when not sorting by score to avoid wasting time on relevance scoring
            query:
              filters && !_.has('sort._score', aggs)
                ? constantScore(filters)
                : filters,
            // If there are aggs, skip search results
            ...(aggs.aggs && { size: 0 }),
            // Sorting by _doc is more efficient for scrolling since it won't waste time on any sorting
            ...(scroll && { sort: ['_doc'] }),
            ...aggs,
          },
        })

    let requestOptions = _.merge({ headers: requestorContext }, config.request)

    let client = config.getClient()
    // If we have a scrollId, use a different client API method
    let search = scrollId ? client.scroll : client.search
    var response
    try {
      var { body: response } = await search(request, requestOptions)
    } catch (e) {
      response = e
      node.error = e.meta.body
    }

    // Log Request
    node._meta.requests.push({ request, requestOptions, response })

    return response
  },
  getSchemas: () => getESSchemas(config.getClient()),
})

module.exports = ElasticsearchProvider
