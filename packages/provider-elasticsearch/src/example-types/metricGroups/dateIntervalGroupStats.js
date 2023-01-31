import _ from 'lodash/fp.js'
import moment from 'moment'
import { groupStats } from './groupStatUtils.js'

//translate meta data in interval names to match the contract for Elastic Search
let toElasticInterval = _.flow(_.replace('fiscal', ''), _.toLower)

let isFiscal = _.includes('fiscal')

let fieldFiscalMappingOr = _.curry((interval, field) =>
  isFiscal(interval) ? `${field}.fiscal` : field
)

/*
 *   hoistProps allows the fields within to be hoisted to top of mapping structure
 *   this is to avoid having issues in which this is not allowed at the same level
 *   of a filter
 *
 *   **PRETTY IGNORE: needed to not change the ${} formatting, this is done to
 *   make the script readable and have the tests pass without relying on far
 *   indented the template string it
 */
/* prettier-ignore */
let getFiscalMappings = _.curry((toFiscalField,{field, monthOffset}) => ({
  runtime_mappings: {
    [toFiscalField(field)]: {
      type: 'date',
      script: {
        source: `if(doc['${field}'].size()!=0){${''
                      }emit(doc['${field}']${''
                    }.value.plusMonths(params['monthOffset']).toInstant().toEpochMilli())${''
                  }}`,
        params: {
          monthOffset
        },
      },
    },
  },
}))

let wrapHoistProps = hoistProperties => ({ hoistProps: { ...hoistProperties } })

let drilldown = ({ field, interval, drilldown, monthOffset = 3 }) => {
  let fiscalOrField = fieldFiscalMappingOr(interval)
  interval = toElasticInterval(interval)
  let gte = drilldown
  let lte = moment.parseZone(drilldown).endOf(interval).format()
  return {
    ...(isFiscal(fiscalOrField(field)) &&
      wrapHoistProps(getFiscalMappings(fiscalOrField, { field, monthOffset }))),
    range: { [fiscalOrField(field)]: { gte, lte } },
  }
}

let buildGroupQuery = (node, children, groupsKey) => {
  let { field, interval = 'year', monthOffset = 3 } = node
  let fiscalOrField = fieldFiscalMappingOr(interval)
  interval = toElasticInterval(interval) //fiscal only includes quarters and years
  /*
   *   Federal fiscal year quarters have the
   *   same start and end dates as conventional
   *   calendar year quarters but offset forward by one.
   *   e.g. calendarYear2022Q1 => federalFiscalYear2022Q2
   *       calendarYear2022Q4 => federalFiscalYear2023Q
   */
  return {
    ...(isFiscal(fiscalOrField(field)) &&
      wrapHoistProps(getFiscalMappings(fiscalOrField, { field, monthOffset }))),
    aggs: {
      [groupsKey]: {
        date_histogram: {
          field: fiscalOrField(field),
          interval,
          min_doc_count: 0,
        },
        ...children,
      },
    },
  }
}

export default {
  ...groupStats(buildGroupQuery),
  drilldown,
}
