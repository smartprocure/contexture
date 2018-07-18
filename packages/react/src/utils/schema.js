import _ from 'lodash/fp'
import * as F from 'futil-js'

export let applyDefaults = F.mapValuesIndexed((val, field) => ({
  field,
  label: F.autoLabel(field),
  order: 0,
  display: x => F.when(_.get('push'), _.join(', '))(x),
  ...val,
}))
