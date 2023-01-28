import _ from 'lodash/fp.js'

export default {
  hasValue: ({ value }) => _.isBoolean(value),
  filter: ({ field, value }) => ({ term: { [field]: value } }),
}
