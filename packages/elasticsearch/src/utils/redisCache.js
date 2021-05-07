let crypto = require('crypto')
let _ = require('lodash/fp')
let F = require('futil')
let deterministic_stringify = require('json-stable-stringify')

let redisCache = (config, schema) => {
  let { redisCache, redisPrefix = 'es-cache:' } = config
  let redisClient = F.maybeCall(config.getRedisClient)
  let { caching: { ttlSecs } = {} } = schema

  // to resolve duplicate requests with the same promise
  let instaCache = new Map()
  let instaCached = f => key => {
    let promise = instaCache.get(key)
    if (!promise) {
      promise = f(key)
      instaCache.set(key, promise)
      promise.finally(() => instaCache.delete(key))
    }
    return promise
  }

  return search => (request, options) => {
    if (!redisCache || !redisClient || !ttlSecs) return search(request, options)

    let key = `${redisPrefix}:${hash(request)}`

    let fetch = async () => {
      let cachedData = await redisClient.get(key)
      if (cachedData)
        return JSON.parse(cachedData)

      let data = await search(request, options)
      // not awaiting, so we respond to the user faster
      setData(data)

      return data
    }

    let setData = data => redisClient.setex(key, ttlSecs, JSON.stringify(data))

    return instaCached(fetch)()
  }
}

let hashString = data =>
  crypto
    .createHash('sha1')
    .update(data)
    .digest('base64')

let hash = _.pipe(deterministic_stringify, hashString)

module.exports = redisCache
