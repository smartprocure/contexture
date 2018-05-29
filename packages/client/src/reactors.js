import _ from 'lodash/fp'
import * as F from 'futil-js'
import { hasContext, hasValue } from './node'

let reactors = {
  others: (parent, node) =>
    parent.join === 'or' ? [] : _.difference(parent.children, [node]),
  self: (parent, node) => [node],
  all: parent => parent.children,
  standardChange(parent, node, { previous }, reactors) {
    let needUpdate = hasContext(node)
    let affectsOthers = hasValue(node) || hasValue(previous)
    let reactor
    if (needUpdate) {
      reactor = 'self'
    } else if (affectsOthers) {
      reactor = 'others'
    } else if (affectsOthers && needUpdate) {
      reactor = 'all'
    }
    return reactors(reactor)
  },
}

export let StandardReactors = {
  refresh: reactors.all,
  join(parent, node, { previous }, reactor) {
    let childrenWithValues = _.filter(hasValue, node.children)
    let joinInverted = node.join === 'not' || previous.join === 'not'
    if (childrenWithValues.length > 1 || joinInverted) return reactor('all')
  },
  add: reactors.standardChange,
  remove(parent, node, { previous }, reactor) {
    // BUG: Remove reactor should consider if anything else had a value because it makes it optional if it doesn't have one
    // If it's in an OR group and now there's only 1 rule left that rule becomes required
    if (hasValue(previous)) return reactor('all')
  },
  paused(
    parent,
    node,
    {
      value: { paused },
    },
    reactor
  ) {
    if (!paused && node.missedUpdate) {
      // Reactor probably shouldn't mutate but this needs to clear somewhere :/
      node.missedUpdate = false
      return reactor('self')
    }
  },
  // ported from main app ¯\_(ツ)_/¯
  field: reactors.standardChange,
  type: reactors.standardChange,
  mutate: (parent, node, event, reactor, types, lookup) =>
    _.flow(
      _.keys,
      // assumes reactors are { field: reactor, ...}
      _.map(
        F.aliasIn(_.getOr({}, `${lookup(event.path).type}.reactors`, types))
      ),
      _.uniq,
      _.flatMap(reactor),
      _.compact,
      _.uniq
    )(event.value),
}
let Reactor = (x, customReactors = {}) =>
  customReactors[x] || StandardReactors[x] || reactors[x] || _.noop

export let getAffectedNodes = customReactors => (
  { type, ...event },
  lookup,
  types,
  path
) => {
  let node = lookup(path)
  // Parent defaults to a fake root since reactors don't handle null parents
  let parent = lookup(_.dropRight(1, path)) || { children: [node] }
  let reactor = x =>
    Reactor(x, customReactors)(parent, node, event, reactor, types, lookup)
  return reactor(type)
}
