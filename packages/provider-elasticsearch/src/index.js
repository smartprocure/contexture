import _ from 'lodash/fp.js'
import { hoistOnTree } from './utils/results.js'
import { getESSchemas } from './schema.js'
import _debug from 'debug'
import { isAtLeastVersion8 } from './compat.js'

let debug = _debug('contexture:elasticsearch')

let revolvingCounter = (max) => {
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

let constantScore = (filter) => ({
  constant_score: { filter: getFilterOrIgnoreVal(filter) },
})

//Elastic ignores entries that resolve to undefined
let getFilterOrIgnoreVal = (filters) =>
  _.isEmpty(filters) ? undefined : filters

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
    let client = config.getClient()
    let hoistedFromFilters = hoistOnTree(filters)
    let hoistedFromAggs = hoistOnTree(aggs)
    let {
      searchWrapper,
      configOptions = {},
      logger,
      clusterDefaultTimeout,
    } = config
    let { scroll, scrollId } = node
    let request
    // If we have scrollId then keep scrolling, no query needed
    if (scrollId) {
      let body = { scroll_id: scrollId }
      request = {
        scroll: scroll === true ? '60m' : hoistedFromFilters,
        ...(isAtLeastVersion8(client) ? body : { body }),
      }
    }
    // Deterministic ordering of JSON keys for request cache optimization
    else {
      let body = {
        // Wrap in constant_score when not sorting by score to avoid wasting time on relevance scoring
        ...(!_.isEmpty(hoistedFromAggs) && _.mergeAll(hoistedFromAggs)),
        ...(!_.isEmpty(hoistedFromFilters) && _.mergeAll(hoistedFromFilters)),
        query:
          filters && !_.has('sort._score', aggs)
            ? constantScore(filters)
            : filters,
        // If there are aggs, skip search results
        ...(aggs.aggs && { size: 0 }),
        // Sorting by _doc is more efficient for scrolling since it won't waste time on any sorting
        ...(scroll && { sort: ['_doc'] }),
        ...aggs,
      }
      request = {
        ...configOptions,
        index: schema.elasticsearch.index,
        // Scroll support (used for bulk export)
        ...(scroll && { scroll: scroll === true ? '2m' : scroll }),
        ...(isAtLeastVersion8(client) ? body : { body }),
      }
    }

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
      // higher order wrapper function for search caching
      if (searchWrapper && !scroll) search = searchWrapper(search)
    }

    let metaObj = { request, requestOptions }

    node._meta.requests.push(metaObj)
    let count = counter.inc()
    debug('(%s) Request: %O\nOptions: %O', count, request, requestOptions)

    let response
    try {
      response = await search(request, requestOptions)
    } catch (e) {
      // Provide information about the error in the standard `cause` property
      // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause#providing_structured_data_as_the_error_cause
      e.cause = e.meta ?? {}
      delete e.meta
      // Remove duplicated information.
      delete e.cause.meta
      throw e
    }

    let body = isAtLeastVersion8(client) ? response : response?.body

    // If body has timed_out set to true, log that partial results were returned,
    // if partial is turned off an error will be thrown instead.
    // https://www.elastic.co/guide/en/elasticsearch/guide/current/_search_options.html#_timeout_2
    if (body?.timed_out)
      logger &&
        logger(
          `Returned partial search results, took ${body.took}ms
             Timeout Threshold: ${
               configOptions.timeout ||
               clusterDefaultTimeout ||
               // Could grab from cluster settings if not provided with a query
               // but would add overhead so N/A presented if not available from call site.
               'N/A'
             }`
        )

    metaObj.response = body
    debug('(%s) Response: %O', count, body)
    // Log Request

    return metaObj.response
  },
  getSchemas: () => getESSchemas(config.getClient()),
})

export default ElasticsearchProvider
