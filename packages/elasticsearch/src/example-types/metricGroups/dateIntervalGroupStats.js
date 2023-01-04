let moment = require('moment')
let { groupStats } = require('./groupStatUtils')

let drilldown = ({ field, interval, drilldown }) => {
  let gte = drilldown
  let lte = moment
    .parseZone(drilldown)
    .endOf(interval)
    .format()
  return { range: { [field]: { gte, lte } } }
}

let isOffsetDates = node => {
  if (
    node.interval === 'federalFiscalYear' ||
    node.interval === 'federalFiscalQuarter'
  )
    return true
  return false
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
                if(doc['${field}'].size()!=0) {
                  emit(doc['${field}'].value.plusMonths(3).toInstant().toEpochMilli())
                }`,
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

module.exports = {
  ...groupStats(buildGroupQuery),
  drilldown,
}
