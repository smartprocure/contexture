import _ from 'lodash/fp'
import { ContextTree } from 'contexture-client'
import { observable, toJS, extendObservable, action } from 'mobx'

export default x => _.flow(
  observable,
  ContextTree({
    snapshot: toJS,
    extend: extendObservable,
    ...x
  }),
  _.update('add', action),
  _.update('remove', action),
  _.update('mutate', action),
  _.update('refresh', action)
)