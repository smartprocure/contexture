import _ from 'lodash/fp'
import { lookup } from './util/tree'

// TODO check type, etc
let hasContext = node => node.context

let reactors = {
  others: (parent, instigator) =>
    parent.join === 'or' ? [] : _.difference(parent.children, [instigator]),
  only: (parent, instigator) => [instigator],
  all: parent => parent.children,
  async standardChange(
    parent,
    instigator,
    previous,
    hasValue,
    value,
    validateGroup
  ) {
    let needUpdate = hasContext(instigator)
    let affectsOthers =
      hasValue(instigator) || (previous && (await validateGroup(previous)))
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
  join(parent, instigator, previous, hasValue) {
    let childrenWithValues = _.filter(hasValue, instigator.children)
    let joinInverted = instigator.join === 'not' || previous.join === 'not'
    if (childrenWithValues.length > 1 || joinInverted)
      return reactors.all(...arguments)
  },
  add: reactors.standardChange,
  async remove(parent, instigator, previous, _x, value, validateGroup) {
    if (await validateGroup(previous)) return reactors.all(...arguments)
  },
  paused(parent, instigator, previous, _x, value) {
    if (!value && instigator.missedUpdates) {
      // Reactor probably shouldn't mutate but this needs to clear somewhere :/
      // maybe in reactor??
      instigator.missedUpdates = false
      return reactors.only(...arguments)
    }
  },
  // ported from main app ¯\_(ツ)_/¯
  field: reactors.standardChange,
  type: reactors.standardChange,
}

export let getAffectedNodes = _.curry(
  async (
    { type, path, value, previous },
    hasValueMap,
    validateGroup,
    node,
    p
  ) => {
    let instigatorPath = _.difference(path, p)[0]
    let instigator = lookup(node, instigatorPath)
    return (StandardReactors[type] || _.noop)(
      node,
      instigator,
      previous,
      hasValueMap,
      value,
      validateGroup
    )
  }
)
