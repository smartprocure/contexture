let F = require('futil')
let _ = require('lodash/fp')
let { getDateIfValid, rollingRangeToDates } = require('../../utils/dateUtil')

let getDateRange = (range, timezone) => {
  let { from, to } = rollingRangeToDates(range, timezone)
  return F.compactObject({
    from: getDateIfValid(from),
    to: getDateIfValid(to),
  })
}

module.exports = {
  hasValue: _.get('values.length'),
  /**
   * VALID CONTEXT
   * 1. Must have "field" (String) and "ranges" (Array) properties
   * 2. Each range object must have a "key" property
   * 3. Each range must have a "range" property with the range phrase
   */
  validContext: node =>
    _.has('field', node) &&
    !!_.get('ranges.length', node) &&
    _.every(r => _.has('key', r) && _.has('range', r), node.ranges),
  /**
   * FILTER
   * Based on the keys checked we get the actual values
   * from the node.ranges and compose a bool/should query.
   **/
  filter({ field, ranges, values, timezone = 'UTC' }) {
    let should = _.flow(
      _.filter(r => _.includes(r.key, values)),
      _.map(({ range }) => ({
        range: {
          [field]: {
            format: 'date_optional_time',
            ...getDateRange(range, timezone),
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
    let counts = await search({
      aggs: {
        range: {
          date_range: {
            field,
            format: format || 'date_optional_time',
            ranges: _.map(
              ({ range, key }) => ({
                key,
                ...getDateRange(range, timezone),
              }),
              ranges
            ),
          },
        },
      },
      size: 0,
    })
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
