let _ = require('lodash/fp')
let { getESSchemas } = require('./schema')
let redisCache = require('./utils/redisCache')

let constantScore = filter => ({ constant_score: { filter } })

let ElasticsearchProvider = (config = { request: {} }) => {
  let cached = redisCache(config)
  return {
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
    async runSearch({ requestOptions } = {}, node, schema, filters, aggs) {
      let { scroll, scrollId } = node
      let request = scrollId
        ? // If we have scrollId then keep scrolling, no query needed
          { scroll: scroll === true ? '60m' : scroll, scrollId }
        : // Deterministic ordering of JSON keys for request cache optimization
          {
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
          }

      let client = config.getClient()
      let child = client.child({
        headers: requestOptions.headers,
        requestTimeout: requestOptions.requestTimeout,
      })
      // If we have a scrollId, use a different client API method
      // The new elasticsearch client uses `this`, so we can just pass aroud `client.search` :(
      let search
      if (scrollId) search = (...args) => child.scroll(...args)
      else {
        search = (...args) => child.search(...args)
        if (!scroll) search = cached(search, schema)
      }

      let response
      try {
        let { body } = await search(request, requestOptions)
        response = body
      } catch (e) {
        console.error({ e })
        response = e
        node.error = e.meta.body.error
        throw {
          message: `${e}`,
          ...e.meta.body.error,
        }
      }

      // Log Request
      node._meta.requests.push({ request, requestOptions, response })

      return response
    },
    getSchemas: () => getESSchemas(config.getClient()),
  }
}

module.exports = ElasticsearchProvider
