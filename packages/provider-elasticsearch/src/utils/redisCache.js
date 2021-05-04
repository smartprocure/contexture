let F = require('futil')
let deterministic_stringify = require('json-stable-stringify')

let redisCache = (config, { caching: { ttlSecs } = {} }) => {
  let redisClient = F.maybeCall(config.getRedisClient)
  let { redisCache, redisPrefix = 'es-cache:' } = config

  return search => async (request, options) => {
    if (!redisCache || !redisClient || !ttlSecs) return search(request, options)

    let key = `${redisPrefix}:${deterministic_stringify(request)}`
    let cachedData = await redisClient.get(key)

    let setData = data => redisClient.setex(key, ttlSecs, JSON.stringify(data))

    let tryRefresh = async () => {
      let ttl = await redisClient.ttl(key)
      // if past half of expiration time
      if (ttl < ttlSecs / 2) {
        // this protects from concurrent refreshes
        // in case ES is down cache will be still working
        redisClient.expire(key, ttlSecs)
        // update cache with actual fresh data in background
        setData(await search(request, options))
      }
    }

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
}

module.exports = redisCache
