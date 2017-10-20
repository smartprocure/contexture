import _ from 'lodash/fp'
import {validateGroup} from './validation'
import {lookup} from './tree'

// TODO check type, etc
let hasContext = node => node.context

let reactors = {
  others: (parent, instigator) =>
    parent.join == 'or' ? [] : _.difference(parent.children, [instigator]),
  only: (parent, instigator) => [instigator],
  all: parent => parent.children,
  standardChange: async (...args) => {
    let [parent, instigator, previous, hasValueMap] = args
    let needUpdate = hasContext(instigator)
    let affectsOthers =
      hasValueMap[instigator.path] ||
      (previous && (await validateGroup(previous)))
    let reactor
    if (needUpdate) {
      reactor = reactors.only
    } else if (affectsOthers) {
      reactor = reactors.others
    } else if (affectsOthers && needUpdate) {
      reactor = reactors.all
    }
    if (reactor) return reactor(...args)
  }
}

export let StandardReactors = {
  refresh: reactors.all,
  data: reactors.others,
  config: reactors.only,
  join: (...args) => {
    let [parent, instigator, previous, hasValueMap] = args
    let childrenWithValues = _.filter(
      child => hasValueMap[child.path],
      instigator.children
    )
    let joinInverted = instigator.join == 'not' || previous.join == 'not'
    if (childrenWithValues.length > 1 || joinInverted)
      return reactors.all(...args)
  },
  add: reactors.standardChange,
  remove: async (...args) => {
    let [parent, instigator, previous, hasValueMap] = args
    if (await validateGroup(previous)) return reactors.all(...args)
  },
  paused: (...args) => {
    let [parent, instigator, previous, hasValueMap, value] = args
    if (!value && instigator.missedUpdates) {
      // Reactor probably shouldn't mutate but this needs to clear somewhere :/
      // maybe in reactor??
      instigator.missedUpdates = false
      return reactors.only(...args)
    }
  },
  // ported from main app ¯\_(ツ)_/¯
  field: reactors.standardChange,
  type: reactors.standardChange
}

export let getAffectedNodes = _.curry(
  async ({type, path, value, previous}, hasValueMap, node, p) => {
    let instigatorPath = _.difference(path, p)[0]
    let instigator = lookup(node, instigatorPath)
    return (StandardReactors[type] || _.noop)(
      node,
      instigator,
      previous,
      hasValueMap,
      value
    )
  }
)
