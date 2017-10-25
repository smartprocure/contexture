let _ = require('lodash/fp')
let esTwoLevel = require('./esTwoLevelAggregation').result

module.exports = {
  validContext: context =>
    !!(
      context.config.key_field &&
      context.config.value_field &&
      context.config.ranges
    ),
  result: (context, search) =>
    esTwoLevel(
      _.merge(
        {
          config: {
            key_type: 'range',
            key_data: {
              ranges: context.config.ranges,
            },
            value_type: 'stats',
          },
        },
        context
      ),
      search
    ),
}
