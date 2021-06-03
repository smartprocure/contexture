let _ = require('lodash/fp')
let { getESSchemas } = require('./schema')
let debug = require('debug')('contexture:elasticsearch')

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

let constantScore = filter => ({ constant_score: { filter } })

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
  async runSearch({ requestOptions = {} } = {}, node, schema, filters, aggs) {
    let { searchWrapper } = config
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

    let child = config.getClient().child({
      headers: requestOptions.headers,
      requestTimeout: requestOptions.requestTimeout,
    })
    // If we have a scrollId, use a different client API method
    // The new elasticsearch client uses `this`, so we can just pass aroud `client.search` :(
    let search
    if (scrollId) search = (...args) => child.scroll(...args)
    else {
      search = (...args) => child.search(...args)
      // higher order wrapper function for search caching
      if (searchWrapper && !scroll) search = searchWrapper(search)
    }

    let metaObj = { request, requestOptions }

    try {
      // Log Request
      node._meta.requests.push(metaObj)
      let count = counter.inc()
      debug('(%s) Request: %O\nOptions: %O', count, request, requestOptions)
      let { body } = await search(request, requestOptions)
      metaObj.response = body
      debug('(%s) Response: %O', count, body)
    } catch (e) {
      console.error({ e })
      metaObj.response = e
      node.error = e.meta.body.error
      throw {
        message: `${e}`,
        ...e.meta.body.error,
      }
    }

    return metaObj.response
  },
  getSchemas: () => getESSchemas(config.getClient()),
})

module.exports = ElasticsearchProvider
