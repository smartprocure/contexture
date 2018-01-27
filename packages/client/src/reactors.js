import _ from 'lodash/fp'
import { Tree } from './util/tree'

// TODO check type, etc
let hasContext = node => node.context
let hadValue = previous => {
  if (previous && previous.hasValue === undefined)
    throw Error('Node was never validated')
  return previous && previous.hasValue && !previous.error
}

let reactors = {
  others: (parent, instigator) =>
    parent.join === 'or' ? [] : _.difference(parent.children, [instigator]),
  only: (parent, instigator) => [instigator],
  all: parent => parent.children,
  standardChange(parent, instigator, previous) {
    let needUpdate = hasContext(instigator)
    let affectsOthers = hadValue(instigator) || hadValue(previous)
    let reactor
    if (needUpdate) {
      reactor = reactors.only
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
  config: reactors.only,
  join(parent, instigator, previous) {
    let childrenWithValues = _.filter(hadValue, instigator.children)
    let joinInverted = instigator.join === 'not' || previous.join === 'not'
    if (childrenWithValues.length > 1 || joinInverted)
      return reactors.all(...arguments)
  },
  add: reactors.standardChange,
  remove(parent, instigator, previous) {
    if (hadValue(previous)) return reactors.all(...arguments)
  },
  paused(parent, instigator, previous, value) {
    if (!value && instigator.missedUpdates) {
      // Reactor probably shouldn't mutate but this needs to clear somewhere :/
      instigator.missedUpdates = false
      return reactors.only(...arguments)
    }
  },
  // ported from main app ¯\_(ツ)_/¯
  field: reactors.standardChange,
  type: reactors.standardChange,
}

export let getAffectedNodes = _.curry(
  ({ type, path, value, previous }, node, p) => {
    let instigatorPath = _.difference(path, p)[0]
    let instigator = Tree.lookup([instigatorPath], node)
    let reactor = StandardReactors[type] || _.noop
    return reactor(node, instigator, previous, value)
  }
)
