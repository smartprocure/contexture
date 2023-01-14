import _ from 'lodash/fp.js'
import { eventEmitter, hasSome } from './util/futil.js'
import { encode } from './util/tree.js'

export let setupListeners = (tree) => {
  let { on, emit } = eventEmitter()
  // Assume first arg is node which might have path
  tree.onChange = (node = {}, delta) => emit(encode(node.path), node, delta)
  // Public API
  tree.watchNode = (path, f, keys) =>
    on(encode(path), (node, delta) => {
      // Trigger watcher if keys match or no keys passed
      if (_.isEmpty(keys) || hasSome(keys, delta)) f(node, delta)
    })
}
