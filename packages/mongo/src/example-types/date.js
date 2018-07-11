let _ = require('lodash')
let moment = require('moment')
let datemath = require('@elastic/datemath')

module.exports = {
  hasValue: context => context.from || context.to,
  filter({ from, to, field, useDateMath, dateType = 'date' }) {
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
      from = datemath.parse(from)
      to = datemath.parse(to)
    }
    
    let format = {
      date: x => x && moment.utc(x).toDate(),
      unix: x => x && moment.utc(x).unix(),
      timestamp: x => x && (new Date(x).getTime())
    }[dateType]

    return {
      [field]: _.pickBy(
        {
          $gte: format(from),
          $lte: format(to),
        },
        _.identity
      ),
    }
  },
}
