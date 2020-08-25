let { statsAggs, simplifyBuckets } = require('./utils')

let buildQuery = ({ groupField, statsField, stats, interval = 'year' }) => ({
  aggs: {
    groups: {
      date_histogram: { field: groupField, interval, min_doc_count: 0 },
      ...statsAggs(statsField, stats),
    },
  },
})

module.exports = {
  buildQuery,
  validContext: node => node.groupField && node.statsField,
  result: async (node, search) => {
    let response = await search(buildQuery(node))
    return { results: simplifyBuckets(response.aggregations.groups.buckets) }
  },
}


let docs = {
  description: 'A nested stats aggregation inside a dateHistogram aggregation.',
  inputs: {
    groupField: {
      type: 'string',
      default: 'none, required',
      description: 'field to group by',
    },
    statsField: {
      type: 'string',
      default: 'optional, if omitted, no stats except count are returned',
      description: 'field on which to calculate stats (metrics). Generally a number field',
    },
    stats: {
      type: 'string[]: min|max|avg|sum',
      default: '[min, max, avg, sum]',
      description: 'Which stats to include',
    },

    interval: {
      type: 'string: year|quarter|month|week',
      default: 'year',
      description: 'date interval in which to group the data into',
    },
  },
  outputs: {
    results: { type: '[{ key, count, ...stats(min|max|avg|sum) }]' },
  },
}

let docs2 =

{
  description: 'A nested stats aggregation inside a dateHistogram aggregation.',
  inputs: [
    { name: 'groupField',
      type: 'string',
      default: 'none, required',
      description: 'field to group by',
    },
    { name: 'statsField',
      type: 'string',
      default: 'optional, if omitted, no stats except count are returned',
      description: 'field on which to calculate stats (metrics). Generally a number field',
    },
    { name: 'stats',
      type: 'string[]: min/max/avg/sum',
      default: '[min, max, avg, sum]',
      description: 'Which stats to include',
    },

    { name: 'interval',
      type: 'string: year/quarter/month/week',
      default: 'year',
      description: 'date interval in which to group the data into',
    },
  ],
  outputs: {
    results: { type: '[{ key, count, ...stats(min|max|avg|sum) }]' },
  },
}
