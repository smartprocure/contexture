let _ = require('lodash/fp')
let moment = require('moment-timezone')
let datemath = require('@elastic/datemath')

module.exports = {
  hasValue: context => context.from || context.to,
  filter({ from, to, field, useDateMath, isDateTime, timezone }) {
    if (useDateMath) {
      if (from === 'thisQuarter') {
        from = moment()
          .quarter(moment().quarter())
          .startOf('quarter')
          .format('YYYY-MM-DD')
        to = `${from}||+3M-1d/d`
      } else if (from === 'lastQuarter') {
        from = moment()
          .quarter(moment().quarter() - 1)
          .startOf('quarter')
          .format('YYYY-MM-DD')
        to = `${from}||+3M-1d/d`
      } else if (from === 'nextQuarter') {
        from = moment()
          .quarter(moment().quarter() + 1)
          .startOf('quarter')
          .format('YYYY-MM-DD')
        to = `${from}||+3M-1d/d`
      }
      from = moment.tz(datemath.parse(from), timezone).utc().toDate()
      to = moment.tz(datemath.parse(to), timezone).utc().toDate()
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
