let F = require('futil')
let _ = require('lodash/fp')
let { getDateIfValid, rollingRangeToDates } = require('../dateUtil')

let getDateRange = (range, timezone) => {
  let { from, to } = rollingRangeToDates(range, timezone)
  return F.compactObject({
    from: getDateIfValid(from),
    to: getDateIfValid(to),
  })
}

module.exports = {
  hasValue: context => _.get('values.length', context),
  /**
   * VALID CONTEXT
   * 1. Must have "field" (String) and "ranges" (Array) properties
   * 2. Each range object must have a "key" property
   * 3. Each range must have a "range" property with the range phrase
   */
  validContext: context =>
    _.has('field', context) &&
    !!_.get('ranges.length', context) &&
    _.every(r => _.has('key', r) && _.has('range', r), context.ranges),
  /**
   * FILTER
   * Based on the keys checked we get the actual values
   * from the context.ranges and compose a bool/should query.
   **/
  filter(context) {
    let { field, ranges, values, timezone = 'UTC' } = context
    let should = _.flow(
      _.filter(r => _.includes(r.key, values)),
      _.map(({ range }) => ({
        range: {
          [field]: {
            format: 'dateOptionalTime',
            ...getDateRange(range, timezone),
          },
        },
      }))
    )(ranges)

    return { bool: { should } }
  },
  /**
   * RESULT
   * Context should have `ranges` prop where each range has a "key"
   * Ranges should have 'range' prop containing the range phrase (eg. 'allFutureDates')
   * Example:
      ranges: [
        { range: 'allFutureDates', key: "Open" },
        { range: 'allPastDates', key: "Expired" }
      ]
   */
  async result(context, search) {
    let { field, format, timezone = 'UTC', ranges } = context
    let counts = await search({
      aggs: {
        range: {
          date_range: {
            field,
            format: format || 'dateOptionalTime',
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
