let F = require('futil')
let _ = require('lodash/fp')
let { rollingRangeToDates, getDateIfValid } = require('../dateUtil')

let hasValue = ({ from, to, range }) =>
  range &&
  range !== 'allDates' &&
  ((range === 'exact' && (from || to)) || range !== 'exact')

module.exports = {
  hasValue,
  // NOTE: timezone is only used for rolling dates
  filter({ field, range, isDateTime, timezone = 'UTC', ...context }) {
    let { from, to } = _.includes(range, ['exact', 'allDates'])
      ? context
      : rollingRangeToDates(range, timezone)

    // If isDateTime we do not format but rely on the input to be in ES date & time format currently
    if (!isDateTime) {
      from = getDateIfValid(from)
      to = getDateIfValid(to)
    }

    return {
      range: {
        [field]: F.compactObject({
          gte: from,
          lte: to,
          // Only force date formatting on the date range filter.
          format: 'dateOptionalTime',
        }),
      },
    }
  },
}
