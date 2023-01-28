import _ from 'lodash/fp.js'

export default {
  hasValue: ({ value }) => _.isBoolean(value),
  filter: ({ field, value }) => ({
    [field]: value || { $ne: true },
  }),
}
