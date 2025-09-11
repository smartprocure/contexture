import F from 'futil'
import _ from 'lodash/fp.js'
import {
  getDateIfValid,
  rollingRangeToDates,
} from 'contexture-util/dateUtil.js'

const typeToFields = {
  range: {
    fromField: 'gte',
    toField: 'lte',
  },
  date_range: {
    fromField: 'from',
    toField: 'to',
  },
}

let getDateRange = (range, timezone, type) => {
  let { from, to } = rollingRangeToDates(range, timezone)
  let { fromField, toField } = typeToFields[type]

  return F.compactObject({
    [fromField]: getDateIfValid(from),
    [toField]: getDateIfValid(to),
  })
}

const genAggsQuery = (field, format, ranges, timezone) => ({
  aggs: {
    range: {
      date_range: {
        field,
        format: format || 'date_optional_time',
        ranges: _.map(
          ({ range, key }) => ({
            key,
            ...getDateRange(range, timezone, 'date_range'),
          }),
          ranges
        ),
      },
    },
  },
  size: 0,
})

var dateRangeFacet_default = {
  hasValue: _.get('values.length'),
  /**
   * VALID CONTEXT
   * 1. Must have "field" (String) and "ranges" (Array) properties
   * 2. Each range object must have a "key" property
   * 3. Each range must have a "range" property with the range phrase
   */
  validContext: (node) =>
    _.has('field', node) &&
    !!_.get('ranges.length', node) &&
    _.every((r) => _.has('key', r) && _.has('range', r), node.ranges),
  /**
   * FILTER
   * Based on the keys checked we get the actual values
   * from the node.ranges and compose a bool/should query.
   **/
  filter({ field, ranges, values, timezone = 'UTC' }) {
    let should = _.flow(
      _.filter((r) => _.includes(r.key, values)),
      _.map(({ range }) => ({
        range: {
          [field]: {
            format: 'date_optional_time',
            ...getDateRange(range, timezone, 'range'),
          },
        },
      }))
    )(ranges)
    return { bool: { should } }
  },
  /**
   * RESULT
   * Node should have `ranges` prop where each range has a "key"
   * Ranges should have 'range' prop containing the range phrase (eg. 'allFutureDates')
   * Example:
      ranges: [
        { range: 'allFutureDates', key: "Open" },
        { range: 'allPastDates', key: "Expired" }
      ]
   */
  async result({ field, format, timezone = 'UTC', ranges }, search) {
    let counts = await search(genAggsQuery(field, format, ranges, timezone))
    return {
      options: _.flow(
        _.get('aggregations.range.buckets'),
        _.map(({ key, doc_count }) => ({
          name: key,
          count: doc_count,
        }))
      )(counts),
    }
  },
}

export { dateRangeFacet_default as default, genAggsQuery }
