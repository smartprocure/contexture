let _ = require('lodash/fp')

module.exports = {
  hasValue: ({ value }) => _.isBoolean(value),
  filter: context => ({
    term: {
      [context.field]: context.value,
    },
  }),
}
