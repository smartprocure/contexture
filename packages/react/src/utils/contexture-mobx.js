import _ from 'lodash/fp'
import ContextureClient from 'contexture-client'
import { observable, toJS, set, action } from 'mobx'

export default x =>
  _.flow(
    observable,
    ContextureClient({
      snapshot: toJS,
      extend: set,
      ...x,
    }),
    // contexture-client here takes a whole observable tree and doesn't make initial values observable itself so we need to wrap new nodes in observable
    _.update('add', add => action((path, node) => add(path, observable(node)))),
    _.update('remove', action),
    _.update('mutate', action),
    _.update('refresh', action)
  )
