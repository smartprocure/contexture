import _ from 'lodash/fp'
import * as f from 'futil-js'
import {flattenTree, bubbleUpAsync, flatLeaves, Tree} from './util/tree'
import {catches, flowAsync} from './util/futil'
import {mapValuesAsync} from './util/promise'

import {validateGroup, validateLeaves} from './validation'
import {getAffectedNodes} from './reactors'
import actions from './actions'
import serialize from './serialize'

// Named Traversals
let markForUpdate = Tree.walk(x => {
  x.markedForUpdate = true
})
let markLastUpdate = time =>
  Tree.walk(child => {
    if (child.markedForUpdate) child.lastUpdateTime = time
  })
let prepForUpdate = Tree.walk(child => {
  if (child.markedForUpdate) {
    child.updating = true
    child.markedForUpdate = false
  }
})
let acknoweldgeMissedUpdates = Tree.walk(child => {
  if (child.paused) child.missedUpdates = true
})


let process = flowAsync(4)(
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
  {
    subscribers = [],
    snapshot = _.cloneDeep,
    debounce = 1,
    debug //= true
  } = {}
) => {
  let log = x => debug && console.log(x)
  let flat = flattenTree(tree)
  let getNode = path => flat[path.join('->')]
  let fakeRoot = { key: 'virtualFakeRoot', path: '', children: [tree] }

  // Event Handling
  let dispatch = async event => {
    let { type, path, dontProcess } = event
    log(`${type} event at ${path} (${dontProcess ? 'internal' : 'user'} event)`)
    _.cond(subscribers)(event)
    if (dontProcess) return // short circuit deepClone and triggerUpdate
    // Avoid race conditions - what matters is state _at the time of dispatch_
    // snapshot might not be needed since await is blocking?
    let hasValueMap = await mapValuesAsync(validateGroup, snapshot(flat))

    // Process from instigator parent up to fake root so affectedNodes are always calculated in context of a group
    await bubbleUpAsync(process(event, hasValueMap), _.dropRight(1, path), flat)
    await process(event, hasValueMap, fakeRoot, fakeRoot.path)

    // trickleDown((node, p) => console.log('down', p, path, node), path, tree)
    return triggerUpdate()
  }
  let triggerUpdate = f.debounceAsync(debounce, async () => {
    if (await shouldBlockUpdate()) return log('Blocked Search')
    let now = new Date().getTime()
    markLastUpdate(now)(tree)
    let dto = serialize(snapshot(tree), {search: true})
    prepForUpdate(tree)
    processResponse(await service(dto, now))
  })
  let shouldBlockUpdate = catches(() => true)(async () => {
    let leaves = flatLeaves(flat)
    let allBlank = _.every(x => !x, await validateLeaves(leaves))
    let noUpdates = !_.some('markedForUpdate', leaves)
    return noUpdates || (!tree.allowBlank && allBlank)
  })
  let processResponse = ({data, error}) => {
    _.each(node => {
      let target = flat[node.path]
      if (!target) return
      let responseNode = _.pick(['context', 'error'], node)
      f.mergeOn(target, responseNode)
      target.updating = false
      if (!node.children)
        dispatch({
          type: 'update',
          path: node.path.split('->'),
          value: responseNode,
          node,
          dontProcess: true
        })
    }, flattenTree(data))
    if (error) tree.error = error
  }

  let {add, remove, mutate} = actions({ getNode, flat, dispatch })
  let subscribe = (f, cond = _.stubTrue) => {
    let index = subscribers.length
    // Potential improvement - optimize for `path` cases and store locally at node (assuming we have lots of subscriptions to different nodes)
    subscribers.push([_.iteratee(cond), f])
    return () => subscribers.splice(index, 1)
  }

  return {
    tree,
    getNode,

    // Actions
    add,
    remove,
    mutate,

    dispatch,
    subscribe,
    serialize: () => serialize(snapshot(tree), {})
  }
}
export default ContextTree
//TODO
//  unify notify subscribers with dispatch/mutate
// subscribe(path, fn, type), fn: (delta, node) -> null
// OR! just `dispatch` the change type as 'update', then allow external subscriptions to dispatch


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


// Improvements
// - Client update logic now accounts for the join relationship! Even more efficient
// - Dispatch (and action methods) return a promise for when it resolves despite debounce (no more subscribable falsey crap)
// - Design Improvements for Performance + Simplicity
//   - Much more memory efficient - functional instead of local function copies
//   - Instant traversals due to flat tree in parallel with nested
//   - Redux-y API













// let Types = {
//   facet: {
//     data: {
//       values: [],
//       mode: 'include'
//     },
//     config: {
//       size: 12,
//       filter: ''
//     },
//     context: {
//       total: 0,
//       options: [],
//       cardinality: 0
//     },
//     : _.every(isNotBlank.config),//node.data.values && node.data.mode,
//     toString() {

//     }
//   }
// }

