import _ from 'lodash/fp'
import * as F from 'futil-js'
import {
  flattenTree,
  bubbleUp,
  flatLeaves,
  decodePath,
  encodePath,
} from './util/tree'
import { flowAsync } from './util/promise'
import { validate } from './validation'
import { getAffectedNodes } from './reactors'
import actions from './actions'
import serialize from './serialize'
import {
  markForUpdate,
  markLastUpdate,
  prepForUpdate,
  acknoweldgeMissedUpdates,
} from './traversals'
import { defaultTypes, runTypeFunction } from './types'

let process = flowAsync(3)(
  getAffectedNodes,
  _.each(n => {
    acknoweldgeMissedUpdates(n)
    if (!_.some('markedForUpdate', n.children)) markForUpdate(n)
  })
)

export let ContextTree = (
  tree,
  service = () => {
    throw new Error('No update service provided!')
  },
  types = defaultTypes,
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
  let getNode = path => flat[encodePath(path)]
  let typeFunction = runTypeFunction(types)
  let { validateGroup } = validate(typeFunction('validate'), extend)
  let fakeRoot = { key: 'virtualFakeRoot', children: [tree] }

  // Event Handling
  let dispatch = async event => {
    let { type, path, dontProcess } = event
    log(`${type} event at ${path} (${dontProcess ? 'internal' : 'user'} event)`)
    _.cond(subscribers)(event)
    if (dontProcess) return // short circuit deepClone and triggerUpdate

    await validateGroup(tree)

    // Process from instigator parent up to fake root so affectedNodes are always calculated in context of a group
    bubbleUp(process(event), _.dropRight(1, path), flat)
    process(event, fakeRoot, '')

    return triggerUpdate()
  }
  let triggerUpdate = F.debounceAsync(debounce, async () => {
    if (shouldBlockUpdate()) return log('Blocked Search')
    let now = new Date().getTime()
    markLastUpdate(now)(tree)
    let dto = serialize(snapshot(tree), { search: true })
    prepForUpdate(tree)
    processResponse(await service(dto, now))
  })
  let shouldBlockUpdate = () => {
    let leaves = flatLeaves(flat)
    let allBlank = !_.some('hasValue', leaves)
    let noUpdates = !_.some('markedForUpdate', leaves)
    let hasErrors = _.some('error', leaves)
    let allowsBlank = tree.allowBlank || allowBlank
    return hasErrors || noUpdates || (!allowsBlank && allBlank)
  }
  let processResponse = ({ data, error }) => {
    F.eachIndexed((node, path) => {
      let target = flat[path]
      if (!target) return
      let responseNode = _.pick(['context', 'error'], node)
      F.mergeOn(target, responseNode)
      target.updating = false
      if (!node.children)
        dispatch({
          type: 'update',
          path: decodePath(path),
          value: responseNode,
          node,
          dontProcess: true,
        })
    }, flattenTree(data))
    if (error) tree.error = error
  }

  let subscribe = (f, cond = _.stubTrue) => {
    let index = subscribers.length
    // Potential improvement - optimize for `path` cases and store locally at node (assuming we have lots of subscriptions to different nodes)
    subscribers.push([_.iteratee(cond), f])
    return () => subscribers.splice(index, 1)
  }

  return {
    ...actions({ getNode, flat, dispatch, snapshot, extend }),
    tree,
    getNode,
    dispatch,
    subscribe,
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
// sergvice adapter + children vs items
// subquery/savedsearch
// tree lenses
// broadcast pausing, just hold on to dispatches?
// Add
//   never updated
