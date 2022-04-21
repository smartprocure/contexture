let _ = require('lodash/fp')
import { intersects, eventEmitter } from './util/futil'
import { encode } from './util/tree'

export let setupListeners = tree => {
  let { on, emit } = eventEmitter()
  // Assume first arg is node which might have path
  tree.onChange = (node = {}, delta) => emit(encode(node.path), node, delta)
  // Public API
  tree.watchNode = (path, f, keys) =>
    on(encode(path), (node, delta) => {
      // Trigger watcher if keys match or no keys passed
      if (!keys || intersects(keys, _.keys(delta))) f(node, delta)
    })
}
