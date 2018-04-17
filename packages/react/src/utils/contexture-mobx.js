import _ from 'lodash/fp'
import { ContextTree } from 'contexture-client'
import { observable, toJS, extendObservable } from 'mobx'

export default x => _.flow(
  observable,
  ContextTree({
    snapshot: toJS,
    extend: extendObservable,
    ...x
  })
)