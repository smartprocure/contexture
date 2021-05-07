let crypto = require('crypto')
let _ = require('lodash/fp')
let F = require('futil')
let deterministic_stringify = require('json-stable-stringify')

let redisCache = config => {
  let { redisCache, redisPrefix = 'es-cache:' } = config
  let redisClient = F.maybeCall(config.getRedisClient)

  // to resolve racing condition with the same promise
  let pending = new Map()
  let dedupedAsync = f => key => {
    let promise = pending.get(key)
    if (!promise) {
      promise = f(key)
      pending.set(key, promise)
      promise.finally(() => pending.delete(key))
    }
    return promise
  }

  return (search, schema) => (request, options) => {
    let { caching: { ttlSecs } = {} } = schema

    if (options.bypassCache || !redisCache || !redisClient || !ttlSecs)
      return search(request, options)

    let key = `${redisPrefix}${hash(request)}`

    let fetch = async key => {
      let cachedData = await redisClient.get(key)
      if (cachedData) return JSON.parse(cachedData)

      let data = await search(request, options)
      // not awaiting, so we respond to the user faster
      redisClient.setex(key, ttlSecs, JSON.stringify(data))

      return data
    }

    return dedupedAsync(fetch)(key)
  }
}

let hashString = data =>
  crypto
    .createHash('sha1')
    .update(data)
    .digest('base64')

let hash = _.flow(deterministic_stringify, hashString)

module.exports = redisCache
