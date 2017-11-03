let _ = require('lodash/fp')
let moment = require('moment')
let datemath = require('@elastic/datemath')

module.exports = {
  hasValue: context => context.data.from || context.data.to,
  filter(context) {
    let from = context.data.from
    let to = context.data.to
    if (context.data.useDateMath) {
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
      range: {
        [context.field]: _.pickBy(_.identity, {
          gte:
            from &&
            moment.utc(new Date(from)).isValid() &&
            moment.utc(new Date(from)).format('YYYY-MM-DD'),
          lte:
            to &&
            moment.utc(new Date(to)).isValid() &&
            moment.utc(new Date(to)).format('YYYY-MM-DD'),
          // Only force date formatting on the date range filter.
          format: 'dateOptionalTime',
        }),
      },
    }
  },
}
