let _ = require('lodash')
let moment = require('moment')
let datemath = require('@elastic/datemath')

module.exports = {
  hasValue: context => context.from || context.to,
  filter(context) {
    let { from, to } = context
    if (context.useDateMath) {
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
    return {
      [context.field]: _.pickBy(
        {
          $gte: from && moment.utc(from).toDate(),
          $lte: to && moment.utc(to).toDate(),
        },
        _.identity
      ),
    }
  },
}
