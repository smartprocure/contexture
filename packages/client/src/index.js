import _ from 'lodash/fp'
import * as F from 'futil-js'
import { flattenTree, bubbleUp, flatLeaves, decode, encode } from './util/tree'
import { validate } from './validation'
import { getAffectedNodes } from './reactors'
import actions from './actions'
import serialize from './serialize'
import { markForUpdate, markLastUpdate, prepForUpdate } from './traversals'
import { runTypeFunction } from './types'
import exampleTypes from './exampleTypes'

let processEvent = F.flurry(
  getAffectedNodes,
  _.each(n => {
    if (!_.some('markedForUpdate', n.children)) markForUpdate(n)
  })
)
let shouldBlockUpdate = (flat, allowsBlank) => {
  let leaves = flatLeaves(flat)
  let allBlank = !_.some('hasValue', leaves)
  let noUpdates = !_.some('markedForUpdate', leaves)
  let hasErrors = _.some('error', leaves)
  return hasErrors || noUpdates || (!allowsBlank && allBlank)
}

export let ContextTree = (
  tree,
  service = () => {
    throw new Error('No update service provided!')
  },
  types = exampleTypes,
  {
    subscribers = [],
    snapshot = _.cloneDeep,
    extend = F.extendOn,
    debounce = 1,
    allowBlank = false,
    debug, //= true
  } = {}
) => {
  let log = x => debug && console.log(x)
  let flat = flattenTree(tree)
  let getNode = path => flat[encode(path)]
  let typeFunction = runTypeFunction(types)
  let validateGroup = validate(typeFunction('validate'), extend)

  // Event Handling
  let dispatch = async event => {
    let { type, path, dontProcess } = event
    log(`${type} event at ${path} (${dontProcess ? 'internal' : 'user'} event)`)
    await validateGroup(tree)
    bubbleUp(processEvent(event, getNode), path)
    await triggerUpdate()
  }
  let triggerUpdate = F.debounceAsync(debounce, async () => {
    if (shouldBlockUpdate(flat, tree.allowBlank || allowBlank))
      return log('Blocked Search')
    let now = new Date().getTime()
    markLastUpdate(now)(tree)
    let dto = serialize(snapshot(tree), { search: true })
    prepForUpdate(tree)
    processResponse(await service(dto, now))
  })
  let processResponse = ({ data, error }) => {
    F.eachIndexed((node, path) => {
      let target = flat[path]
      if (!target) return
      let responseNode = _.pick(['context', 'error'], node)
      // TODO: check lastUpdateTime to prevent race conditions - if lastUpdate exists and this response is older, drop it
      F.mergeOn(target, responseNode)
      target.updating = false
    }, flattenTree(data))
    if (error) tree.error = error
  }

  return {
    ...actions({ getNode, flat, dispatch, snapshot, extend }),
    tree,
    getNode,
    dispatch,
    serialize: () => serialize(snapshot(tree), {}),
  }
}
export default ContextTree

// TODO
//   rearg contexture so types + service can be curried first and reused in app - add two options obj and merge (so we can have defaults)

//TODO
//  unify notify subscribers with dispatch/mutate
// subscribe(path, fn, type), fn: (delta, node) -> null

// TODO
// types (validate, to(Human)String, defaults?, hasContext)
// schemas?
// subscriptions (e.g. cascade)
// make sure all locally tracked props are in _meta or something like that
//    Constrain all update to an update meta method which can be overriden to support observables and notifications
//  both kinds of pausing - normal and queue paused
// sergvice adapter: schema transform + contextMap (should be solved with custom serialize + server aliasing)
// subquery/savedsearch
// tree lenses
// broadcast pausing, just hold on to dispatches?
// Add
//   never updated
