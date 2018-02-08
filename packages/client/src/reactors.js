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
  standardChange(parent, node, { previous }) {
    let needUpdate = hasContext(node)
    let affectsOthers = hadValue(node) || hadValue(previous)
    let reactor
    if (needUpdate) {
      reactor = reactors.self
    } else if (affectsOthers) {
      reactor = reactors.others
    } else if (affectsOthers && needUpdate) {
      reactor = reactors.all
    }
    if (reactor) return reactor(...arguments)
  },
}

export let StandardReactors = {
  refresh: reactors.all,
  data: reactors.others,
  config: reactors.self,
  join(parent, node, { previous }) {
    let childrenWithValues = _.filter(hadValue, node.children)
    let joinInverted = node.join === 'not' || previous.join === 'not'
    if (childrenWithValues.length > 1 || joinInverted)
      return reactors.all(...arguments)
  },
  add: reactors.standardChange,
  remove(parent, node, { previous }) {
    if (hadValue(previous)) return reactors.all(...arguments)
  },
  paused(parent, node, { value: { paused } }) {
    if (!paused && node.missedUpdate) {
      // Reactor probably shouldn't mutate but this needs to clear somewhere :/
      node.missedUpdate = false
      return reactors.self(...arguments)
    }
  },
  // ported from main app ¯\_(ツ)_/¯
  field: reactors.standardChange,
  type: reactors.standardChange,
  mutate: (parent, node, event, types, lookup) =>
    _.flow(
      _.keys,
      // assumes reactors are { field: reactor, ...}
      _.map(F.aliasIn(_.getOr({}, `${lookup(event.path).type}.reactors`, types))),
      _.uniq,
      _.flatMap(x => Reactor(x)(parent, node, event, types)),
      _.compact,
      _.uniq
    )(event.value),
}
let Reactor = x => StandardReactors[x] || reactors[x] || _.noop

export let getAffectedNodes = ({ type, ...event }, lookup, types, path) => {
  let node = lookup(path)
  // Parent defaults to a fake root since reactors don't handle null parents
  let parent = lookup(_.dropRight(1, path)) || { children: [node] }
  return Reactor(type)(parent, node, event, types, lookup)
}
