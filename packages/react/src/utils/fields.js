import _ from 'lodash/fp.js'

export let isField = (x) => x?.typeDefault
export let isDisplayableField = (field) => isField(field) || field?._key
export let fieldsToOptions = _.flow(
  _.map((x) => ({ value: x.field, ...x })),
  _.filter(isDisplayableField)
)
