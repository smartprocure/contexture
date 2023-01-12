let _ = require('lodash/fp')
let moment = require('moment')
let { groupStats } = require('./groupStatUtils')

//translate meta data in interval names to match the contract for Elastic Search
let toElasticInterval = _.flow(_.replace('fiscal', ''), _.toLower)

let isFiscal = _.includes('fiscal')

let fieldFiscalMappingOr = (field, interval) =>
  isFiscal(interval) ? `${field}.fiscal` : field

let drilldown = ({ field, interval, drilldown }) => {
  field = fieldFiscalMappingOr(field, interval)
  interval = toElasticInterval(interval)
  let gte = drilldown
  let lte = moment
    .parseZone(drilldown)
    .endOf(interval)
    .format()
  return { range: { [field]: { gte, lte } } }
}

let buildGroupQuery = (node, children, groupsKey) => {
  let { field, interval = 'year', monthOffset = 3 } = node

  /*
   *   Federal fiscal year quarters have the
   *   same start and end dates as conventional
   *   calendar year quarters but offset forward by one.
   *   e.g. calendarYear2022Q1 => federalFiscalYear2022Q2
   *       calendarYear2022Q4 => federalFiscalYear2023Q
   */
  let untranslatedField = node.field
  field = fieldFiscalMappingOr(field, interval)
  interval = toElasticInterval(interval) //fiscal only includes quarters and years 

  /*
   *   hoistProps allows the fields within to be hoisted to top of mapping structure
   *   this is to avoid having issues in which this is not allowed at the same level
   *   of a filter
   * 
   *   **PRETTY IGNORE: needed to not change the ${} formatting, this is done to 
   *   make the script readable and have the tests pass without relying on far 
   *   indented the template string it
   */
  /* prettier-ignore */ let hoistMappings = isFiscal(field) 
    ? {
        hoistProps: {
          runtime_mappings: {
            [field]: {
              type: 'date',
              script: {
                source: `if(doc['${untranslatedField}'].size()!=0){${''
                              }emit(doc['${untranslatedField}']${''
                            }.value.plusMonths(params['monthOffset']).toInstant().toEpochMilli())${''
                          }}`,
                params: {
                  monthOffset
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
