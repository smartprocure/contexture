import _ from 'lodash/fp.js'

export let hasValue = ({ value }) => _.isBoolean(value)

export let filter = ({ field, value }) => ({ term: { [field]: value } })
