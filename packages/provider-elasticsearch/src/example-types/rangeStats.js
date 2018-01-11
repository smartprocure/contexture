let _ = require('lodash/fp')
let esTwoLevel = require('./esTwoLevelAggregation').result

module.exports = {
  validContext: context =>
    !!(context.key_field && context.value_field && context.ranges),
  result: (context, search) =>
    esTwoLevel(
      _.merge(
        {
          key_type: 'range',
          key_data: {
            ranges: context.ranges,
          },
          value_type: 'stats',
        },
        context
      ),
      search
    ),
}
