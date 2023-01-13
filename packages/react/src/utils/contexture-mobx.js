import _ from 'lodash/fp.js'
import ContextureClient from 'contexture-client'
import { set } from 'mobx'
import { observable, toJS } from '../utils/mobx.js'

let mobxAdapter = { snapshot: toJS, extend: set, initObject: observable }
let ContextureMobx = _.curry((x, y) =>
  ContextureClient({ ...mobxAdapter, ...x })(y)
)
export default ContextureMobx
