let crypto = require('crypto')
let _ = require('lodash/fp')
let F = require('futil')
let deterministic_stringify = require('json-stable-stringify')

let redisCache = (config, schema) => {
  let { redisCache, redisPrefix = 'es-cache:' } = config
  let redisClient = F.maybeCall(config.getRedisClient)
  let { caching: { ttlSecs, ttrSecs } = {} } = schema

  // to resolve duplicate requests with the same promise
  let instaCache = Object.create(null)
  let instaCached = f => key => {
    let promise = instaCache[key]
    if (!promise) {
      promise = f(key)
      promise.finally(() => {
        delete instaCache[key]
      })
    }
    return promise
  }

  return search => (request, options) => {
    if (!redisCache || !redisClient || !ttlSecs) return search(request, options)

    let key = `${redisPrefix}:${hash(request)}`

    let fetch = async () => {
      let cachedData = await redisClient.get(key)

      if (cachedData) {
        // not awaiting for refresh, so no response delay
        tryRefresh()
        return JSON.parse(cachedData)
      } else {
        let data = await search(request, options)

        // not awaiting, so we respond to the user faster
        setData(data)

        return data
      }
    }

    let setData = data => redisClient.setex(key, ttlSecs, JSON.stringify(data))

    let tryRefresh = async () => {
      if (!ttrSecs) return
      let ttl = await redisClient.ttl(key)
      // if past specified refresh time
      if (ttlSecs - ttl >= ttrSecs) {
        // bumping expiration protects from concurrent refreshes
        // popular cache is kept alive if ES is down
        redisClient.expire(key, ttlSecs)
        // update cache with actual fresh data in background
        setData(
          await search(request, {
            ...options,
            // delayed non-blocking search
            runBefore: Date.now() + ttl * 1000,
          })
        )
      }
    }

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
