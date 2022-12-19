let _ = require('lodash/fp')
let moment = require('moment')
let { groupStats } = require('./groupStatUtils')
let { simplifyBuckets } = require('../../utils/elasticDSL')
let { getStats } = require('./stats')

let drilldown = ({ field, interval, drilldown }) => {
  let gte = drilldown
  let lte = moment
    .parseZone(drilldown)
    .endOf(interval)
    .format()
  return { range: { [field]: { gte, lte } } }
}

let supportedFederalFiscalYearMetrics = [
  'sum',
  // TODO
  // 'avg',
  // 'min',
  // 'max',
  // 'percentiles', // maybe can do?
  // 'geo_bounds', // likely can do?
  // 'geo_centroid', // maybe can do but looks tricky
]

let isOffsetDates = node => {
  if (node.interval !== 'federalFiscalYear')
    return false
  if (_.isEmpty(stats)) return false
  return node.stats.every(val =>
    supportedFederalFiscalYearMetrics.includes(val)
  )
}

let buildGroupQuery = (node, children, groupsKey) => {
  let { field, interval = 'year' } = node

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
  if (interval === 'federalFiscalQuarter') interval = 'quarter'

  let offsetDates = isOffsetDates(node)
  if (interval === 'federalFiscalYear') {
    if (offsetDates) {
      interval = 'quarter'
    } else {
      interval = 'year'
    }
  }

  return {
    ...(offsetDates
      ? {
          runtime_mappings: {
            [`${field}-offset`]: {
              type: 'date',
              script: `
            long date = doc['${field}'].value.toInstant().toEpochMilli();
            // Both third and forth quarter of a standard year are 92 days
            // This allows us to simple add 92 days to a date to offset
            // the dates to correspond to a federal fiscal year.
            date += 7862400000; // 92 days
            emit(date);
          `,
            },
          },
        }
      : {}),
    aggs: {
      [groupsKey]: {
        date_histogram: {
          field: offsetDates ? `${field}-offset` : field,
          interval,
          min_doc_count: 0,
        },
        ...children,
      },
    },
  }
}

let processResponse = (response, node) => {
  let offsetDates = isOffsetDates(node)
  if (
    (node.interval === 'federalFiscalYear' ||
      node.interval === 'federalFiscalQuarter') &&
    !offsetDates
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
    response = _.set('aggregations.groups.buckets', offsetBuckets, response)
  }
  // bundle up the quarterly bucketed data for a fiscal year
  if (node.interval === 'federalFiscalYear' && !offsetDates) {
    let aggregatedBuckets = _.flow(
      _.get('aggregations.groups.buckets'),
      _.groupBy(({ key }) => new Date(key).getUTCFullYear()),
      _.mapValues(
        _.reduce(
          (agg, o) => {
            let m = moment(new Date(o.key)).startOf('year')
            let rtn = {
              key: m.valueOf(),
              key_as_string: m.toISOString(),
            }
            rtn.doc_count = agg.doc_count + o.doc_count

            if (o.sum)
              rtn.sum = { value: _.getOr(0, 'sum.value', agg) + o.sum.value }
            return rtn
          },
          { doc_count: 0 }
        )
      ),
      _.values
    )(response)
    response = _.set('aggregations.groups.buckets', aggregatedBuckets, response)
  }
  return response
}

let stats = groupStats(buildGroupQuery)
module.exports = {
  ...stats,
  processResponse,
  drilldown,
  async result(node, search, schema) {
    let query = await stats.buildQuery(node, schema, getStats(search))
    let response = processResponse(await search(query), node)
    let aggs = response.aggregations.valueFilter || response.aggregations
    return { results: simplifyBuckets(aggs.groups.buckets) }
  },
}
