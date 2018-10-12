import F from 'futil'
import _ from 'lodash/fp'

export const setFilterOnly = x =>
  F.deepMap(
    F.when(_.isPlainObject, F.setOn('filterOnly', true)),
    _.cloneDeep(x)
  )
