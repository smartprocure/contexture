let _ = require('lodash/fp')
let esTwoLevel = require('./esTwoLevelAggregation').result

module.exports = {
  validContext: context =>
    !!(context.key_field && context.value_field && context.key_value),
  result(context, search) {
    let filter = {
      [_.get('key_type', context) || 'term']: {
        [context.key_field]: context.key_value,
      },
    }
    return esTwoLevel(
      _.merge(
        {
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
        context
      ),
      search
    )
  },
}
