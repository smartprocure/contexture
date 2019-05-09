import _ from 'lodash/fp'
import * as F from 'futil-js'
import ContextureClient from 'contexture-client'
import { observable, toJS, set, action } from 'mobx'

let mobxAdapter = { snapshot: toJS, extend: set, initObject: observable }
let ContextureMobx = _.curry((x, y) =>
  ContextureClient({ ...mobxAdapter, ...x })(y)
)
export default ContextureMobx