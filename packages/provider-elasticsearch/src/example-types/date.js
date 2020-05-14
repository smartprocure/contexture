let F = require('futil')
let _ = require('lodash/fp')
let moment = require('moment-timezone')
let datemath = require('@elastic/datemath')

// https://www.elastic.co/guide/en/elasticsearch/reference/7.x/common-options.html#date-math
let getStartOfQuarter = (quarterOffset, timezone) => {
  let quarter =
    moment()
      .tz(timezone)
      .quarter() + quarterOffset
  return moment()
    .tz(timezone)
    .quarter(quarter)
    .startOf('quarter')
}

let getEndOfQuarter = date =>
  moment(date)
    .add(1, 'Q')
    .subtract(1, 'ms')

module.exports = {
  hasValue: context => context.from || context.to,
  filter({ from, to, field, useDateMath, isDateTime, timezone = 'UTC' }) {
    if (useDateMath) {
      if (from === 'thisQuarter') {
        from = getStartOfQuarter(0, timezone)
        to = getEndOfQuarter(from)
      } else if (from === 'lastQuarter') {
        from = getStartOfQuarter(-1, timezone)
        to = getEndOfQuarter(from)
      } else if (from === 'nextQuarter') {
        from = getStartOfQuarter(1, timezone)
        to = getEndOfQuarter(from)
      } else {
        from = moment.tz(datemath.parse(from), timezone)
        to = moment.tz(datemath.parse(to), timezone)
      }
    }
    let gte = from
    let lte = to

    let getDateIfValid = x =>
      moment.utc(new Date(x)).isValid() &&
      moment.utc(new Date(x)).format('YYYY-MM-DD')

    // If isDateTime we do not format but rely on the input to be in ES date & time format currently
    if (!isDateTime) {
      gte = getDateIfValid(from)
      lte = getDateIfValid(to)
    }
    return {
      range: {
        [field]: F.compactObject({
          gte,
          lte,
          // Only force date formatting on the date range filter.
          format: 'dateOptionalTime',
        }),
      },
    }
  },
}
