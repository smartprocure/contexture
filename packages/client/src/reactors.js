import _ from 'lodash/fp.js'
import F from 'futil'
import { hasContext, hasValue } from './node.js'

let all = (parent) => _.toArray(parent.children)
let self = (parent, node) => [node]
let others = (parent, node) =>
  parent.join === 'or' ? [] : _.without([node], _.toArray(parent.children))
let standardChange = (parent, node, { node: targetNode, previous }) => {
  let needUpdate = hasContext(targetNode)
  let affectsOthers = hasValue(targetNode) || hasValue(previous)
  if (affectsOthers && needUpdate) return all(parent, node)
  if (affectsOthers) return others(parent, node)
  if (needUpdate) return self(parent, node)
}

export let reactors = {
  others,
  self,
  all,
  standardChange,
  none: () => [],
  refresh: all,
  join(parent, node, { previous }, reactor) {
    let childrenWithValues = _.flow(
      _.toArray,
      _.filter(hasValue)
    )(node.children)
    let joinInverted = node.join === 'not' || previous.join === 'not'
    if (childrenWithValues.length > 1 || joinInverted) return reactor('all')
  },
  add: standardChange,
  remove(parent, node, { previous }, reactor) {
    // BUG: Remove reactor should consider if anything else had a value because it makes it optional if it doesn't have one
    // If it's in an OR group and now there's only 1 rule left that rule becomes required
    if (hasValue(previous)) return reactor('all')
  },
  paused(parent, node, { value: { paused } }, reactor) {
    if (!paused && node.missedUpdate) {
      // Reactor probably shouldn't mutate but this needs to clear somewhere :/
      node.missedUpdate = false
      return reactor('self')
    }
  },
  // ported from main app ¯\_(ツ)_/¯
  field: standardChange,
  type: standardChange,
  mutate: (parent, node, event, reactor, types, lookup) =>
    _.flow(
      _.keys,
      // assumes reactors are { field: reactor, ...}
      _.map(F.aliasIn(_.get(`${lookup(event.path).type}.reactors`, types))),
      _.uniq,
      _.flatMap(reactor),
      _.compact,
      _.uniq,
      F.when(
        // if it doesn't and didn't have a value
        // don't update other nodes
        !hasValue(event.node) && !hasValue(event.previous),
        _.filter(_.eq(node))
      )
    )(event.value),
}
export let getAffectedNodes = (reactors, lookup, types) => (event, path) => {
  let node = lookup(path)

  // Parent defaults to a fake root since reactors don't handle null parents
  let parent = lookup(_.dropRight(1, path)) || { children: [node] }
  let reactor = (x) =>
    F.maybeCall(reactors[x] || x, parent, node, event, reactor, types, lookup)
  return reactor(event.type)
}
