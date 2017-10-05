let _ = require('lodash/fp'),
  histogramResult = require('./smartIntervalHistogram').result

function calcClusters(entries, interval, isSignificant) {
  let clusters = []
  let prev = {count: 0}
  if (!isSignificant) {
    isSignificant = x => x !== 0
  }

  _.each(entry => {
    if (isSignificant(entry.count)) {
      if (!isSignificant(prev.count)) {
        clusters.push([entry.key, entry.key + interval, entry.count])
      } else {
        clusters[clusters.length - 1][1] = entry.key + interval
        clusters[clusters.length - 1][2] += entry.count
      }
    }

    prev = entry
  }, entries)

  return clusters
}

module.exports = {
  validContext: context => context.config.field,
  result: (context, search, schema, provider, options) =>
    histogramResult(context, search).then(histResult => ({
      clusters: _.map(
        cluster => ({
          min: cluster[0],
          max: cluster[1],
          count: cluster[2]
        }),
        calcClusters(histResult.entries, histResult.interval)
      )
    }))
}
