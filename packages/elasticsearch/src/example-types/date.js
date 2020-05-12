let _ = require('lodash/fp')
let moment = require('moment-timezone')
let datemath = require('@elastic/datemath')

let getStartOfQuarter = (quarterOffset, timezone = 'UTC') => {
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
  filter({ from, to, field, useDateMath, isDateTime, timezone }) {
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
        from = datemath.parse(from)
        to = datemath.parse(to)
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
        [field]: _.pickBy(_.identity, {
          gte,
          lte,
          // Only force date formatting on the date range filter.
          format: 'dateOptionalTime',
        }),
      },
    }
  },
}
