let _ = require('lodash/fp')
let esTwoLevel = require('./esTwoLevelAggregation').result

module.exports = {
  validContext: context =>
    !!(
      context.config.key_field &&
      context.config.value_field &&
      context.config.key_value
    ),
  result(context, search) {
    let filter = {
      [_.get('key_type', context.config) || 'term']: {
        [context.config.key_field]: context.config.key_value,
      },
    }
    return esTwoLevel(
      _.merge(
        {
          config: {
            key_type: 'filters',
            key_data: {
              filters: {
                pass: filter,
                fail: {
                  bool: {
                    must_not: filter,
                  },
                },
              },
              field: null,
            },
          },
        },
        context
      ),
      search
    )
  },
}
