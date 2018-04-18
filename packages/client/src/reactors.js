import _ from 'lodash/fp'
import * as F from 'futil-js'

// TODO check type, etc
let hasContext = node => node.context
let throwsError = x => {
  throw Error(x)
} // Throw expressions are stage 0 :(
let hadValue = previous =>
  previous && _.isUndefined(previous.hasValue)
    ? throwsError('Node was never validated')
    : previous && previous.hasValue && !previous.error

let reactors = {
  others: (parent, node) =>
    parent.join === 'or' ? [] : _.difference(parent.children, [node]),
  self: (parent, node) => [node],
  all: parent => parent.children,
  standardChange(parent, node, { previous }, reactors) {
    let needUpdate = hasContext(node)
    let affectsOthers = hadValue(node) || hadValue(previous)
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
    let childrenWithValues = _.filter(hadValue, node.children)
    let joinInverted = node.join === 'not' || previous.join === 'not'
    if (childrenWithValues.length > 1 || joinInverted)
      return reactor('all')
  },
  add: reactors.standardChange,
  remove(parent, node, { previous }, reactor) {
    if (hadValue(previous)) return reactor('all')
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
let Reactor = x => StandardReactors[x] || reactors[x] || _.noop

export let getAffectedNodes = ({ type, ...event }, lookup, types, path) => {
  let node = lookup(path)
  // Parent defaults to a fake root since reactors don't handle null parents
  let parent = lookup(_.dropRight(1, path)) || { children: [node] }
  let reactor = x => Reactor(x)(parent, node, event, reactor, types, lookup)
  return reactor(type)
}
