let _ = require('lodash/fp')
let moment = require('moment')
let { groupStats } = require('./groupStatUtils')

let fiscalTypes = ['federalFiscal']

let drilldown = ({ field, interval, drilldown }) => {
  interval = _.camelCase(_.replace(fiscalTypes, '', interval))
  let gte = drilldown
  let lte = moment
    .parseZone(drilldown)
    .endOf(interval)
    .format()
  return { range: { [field]: { gte, lte } } }
}

let buildGroupQuery = (node, children, groupsKey) => {
  let { field, interval = 'year' } = node
  let defaultMonthFiscalOffset = 3

  /*
   *   Federal fiscal year quarters have the
   *   same start and end dates as conventional
   *   calendar year quarters but offset forward by one.
   *   e.g. calendarYear2022Q1 => federalFiscalYear2022Q2
   *       calendarYear2022Q4 => federalFiscalYear2023Q
   */
  let offsetDates = _.includes('fiscal', _.toLower(interval))
  let untranslatedField = node.field
  field = offsetDates ? `${field}.fiscal` : field //translate to runtime mapped field if fiscal
  interval = _.camelCase(_.replace(fiscalTypes, '', interval)) //fiscal only includes quarters and years

  /*
   *   hoistProps allows the fields within to be hoisted to top of mapping structure
   *   this is to avoid having issues in which this is not allowed at the same level
   *   of a filter
   */
  let hoistMappings = offsetDates
    ? {
        hoistProps: {
          runtime_mappings: {
            [`${field}`]: {
              type: 'date',
              script: {
                source: `if(doc['${untranslatedField}'].size()!=0){\
                        emit(doc['${untranslatedField}']\
                        .value.plusMonths(params['monthOffset']).toInstant().toEpochMilli())}\
                    `,
                params: {
                  monthOffset: defaultMonthFiscalOffset,
                },
              },
            },
          },
        },
      }
    : {}

  return {
    ...hoistMappings,
    aggs: {
      [groupsKey]: {
        date_histogram: {
          field,
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
