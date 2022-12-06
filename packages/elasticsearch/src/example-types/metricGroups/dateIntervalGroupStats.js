let _ = require('lodash/fp')
let { set } = require('lodash')
let F = require('futil')
let moment = require('moment')
let { groupStats } = require('./groupStatUtils')
let { simplifyBuckets } = require('../../utils/elasticDSL')

let drilldown = ({ field, interval, drilldown }) => {
  let gte = drilldown
  let lte = moment
    .parseZone(drilldown)
    .endOf(interval)
    .format()
  return { range: { [field]: { gte, lte } } }
}
let buildGroupQuery = ({ field, interval = 'year' }, children, groupsKey) => {
  // Federal fiscal year quarters have the
  // same start and end dates as conventional
  // calendar year quarters but offset forward by one.
  // e.g. calendarYear2022Q1 => federalFiscalYear2022Q2
  //      calendarYear2022Q4 => federalFiscalYear2023Q1
  // In either federalFiscal interval senario,
  // elasitc computes a date_histogram using `'quarter'`
  // and the date offset and
  // year bucketing (in the case of federalFiscalYear)
  // are computed in node in the `result` function.
  if (interval === 'federalFiscalYear' || interval === 'federalFiscalQuarter')
    interval = 'quarter'

  return {
    aggs: {
      [groupsKey]: {
        date_histogram: { field, interval, min_doc_count: 0 },
        ...children,
      },
    },
  }
}

let stats = groupStats(buildGroupQuery)
let getGroups = aggs => F.unkeyBy('key', aggs.groups.buckets)
module.exports = {
  ...stats,
  async result(node, search, schema) {
    let query = stats.buildQuery(node, schema)
    let response = await search(query)

    if (
      node.interval === 'federalFiscalYear' ||
      node.interval === 'federalFiscalQuarter'
    ) {
      let offsetBuckets = _.flow(
        _.get('aggregations.groups.buckets'),
        _.map(o => {
          // NOTE: the `TZ` of the running node process must be
          // `UTC` for this to work as expected.
          let m = moment(new Date(o.key)).add({ quarter: 1 })
          return {
            ...o,
            key: m.valueOf(),
            key_as_string: m.toISOString(),
          }
        })
      )(response)
      set(response, 'aggregations.groups.buckets', offsetBuckets)
    }
    if (node.interval === 'federalFiscalYear') {
      // compute buckets annual buckets
    }
    return { results: simplifyBuckets(getGroups(response.aggregations)) }
  },
  drilldown,
}
