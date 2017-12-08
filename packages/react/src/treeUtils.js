import _ from 'lodash/fp'
import * as F from 'futil-js'

export let traverse = x => x && x.children && x.children.slice() // mobx needs slice
export let keyPath = key => (_.isString(key) ? { key } : key)
export default F.tree(traverse, keyPath)
