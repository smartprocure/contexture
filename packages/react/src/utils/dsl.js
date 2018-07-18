import * as F from 'futil-js'

export let autoKey = x =>
  F.compactJoin('-', [x.field, x.key_field, x.value_field, x.type])
