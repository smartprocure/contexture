import _ from 'lodash/fp'
import * as F from 'futil-js'
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
    F.updateOn('add', add =>
      action((path, node) => add(path, observable(node)))
    ),
    F.updateOn('remove', action),
    F.updateOn('mutate', action),
    F.updateOn('refresh', action)
  )
