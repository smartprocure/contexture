let F = require('futil')
let moment = require('moment-timezone')
let datemath = require('@elastic/datemath')

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
  hasValue: node => node.from || node.to,
  filter({
    from,
    to,
    field,
    useDateMath,
    dateType = 'date',
    timezone = 'UTC',
  }) {
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

    let format = {
      date: x => x && moment.utc(x).toDate(),
      unix: x => x && moment.utc(x).unix(),
      timestamp: x => x && new Date(x).getTime(),
    }[dateType]

    return {
      [field]: F.compactObject({
        $gte: format(from),
        $lte: format(to),
      }),
    }
  },
}
