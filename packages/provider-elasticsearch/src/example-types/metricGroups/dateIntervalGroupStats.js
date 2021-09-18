let { groupStats } = require('./groupStatUtils')

let buildGroupQuery = ({ field, interval = 'year' }, children) => ({
  aggs: {
    groups: {
      date_histogram: { field, interval, min_doc_count: 0 },
      ...children
    },
  },
})

module.exports = groupStats(buildGroupQuery)
