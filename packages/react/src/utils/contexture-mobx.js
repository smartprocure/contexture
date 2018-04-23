import _ from 'lodash/fp'
import ContextureClient from 'contexture-client'
import { observable, toJS, set, action } from 'mobx'

const mutable = _.convert({ immutable: false })

export default x =>
  _.flow(
    observable,
    ContextureClient({
      snapshot: toJS,
      extend: set,
      ...x,
    }),
    // contexture-client here takes a whole observable tree and doesn't make initial values observable itself so we need to wrap new nodes in observable
    mutable.update('add', add => action((path, node) => add(path, observable(node)))),
    mutable.update('remove', action),
    mutable.update('mutate', action),
    mutable.update('refresh', action)
  )
