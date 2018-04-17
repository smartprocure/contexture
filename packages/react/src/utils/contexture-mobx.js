import _ from 'lodash/fp'
import { ContextTree } from 'contexture-client'
import { observable, toJS, extendObservable, action } from 'mobx'

export default x =>
  _.flow(
    observable,
    ContextTree({
      snapshot: toJS,
      extend: extendObservable,
      ...x,
    }),
    // contexture-client here takes a whole observable tree and doesn't make initial values observable itself so we need to wrap new nodes in observable
    _.update('add', add => action((path, node) => add(path, observable(node)))),
    _.update('remove', action),
    _.update('mutate', action),
    _.update('refresh', action)
  )
