let F = require('futil')
let moment = require('moment-timezone')
let datemath = require('@elastic/datemath')

module.exports = {
  hasValue: node => node.from || node.to,
  filter({ from, to, field, useDateMath, dateType = 'date', timezone }) {
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
      from = moment
        .tz(datemath.parse(from), timezone)
        .utc()
        .toDate()
      to = moment
        .tz(datemath.parse(to), timezone)
        .utc()
        .toDate()
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
