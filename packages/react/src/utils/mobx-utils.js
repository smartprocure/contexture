import _ from 'lodash'
import { isObservable, get as mGet, has as mHas } from 'mobx'

// Until https://github.com/mobxjs/mobx/issues/1549 is resolved
export let get = (obj, path) => (isObservable(obj) ? mGet : _.get)(obj, path)
export let has = (obj, path) => (isObservable(obj) ? mHas : _.has)(obj, path)
