let _ = require('lodash/fp')

module.exports = {
  hasValue: ({ value }) => _.isBoolean(value),
  filter(context) {
    let result = {
      exists: {
        field: context.field,
      },
    }

    if (!context.value) {
      result = {
        bool: {
          must_not: result,
        },
      }
    }

    return result
  },
}
