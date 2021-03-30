import _ from 'lodash/fp'
import * as F from 'futil-js'
import { flatten, bubbleUp, Tree, encode, decode, isParent } from './util/tree'
import { validate } from './validation'
import { getAffectedNodes, reactors } from './reactors'
import actions from './actions'
import serialize from './serialize'
import traversals from './traversals'
import { runTypeFunction } from './types'
import { initNode, hasContext, hasValue, dedupeWalk } from './node'
import exampleTypes from './exampleTypes'
import lens from './lens'
import mockService from './mockService'
import subquery from './subquery'

let mergeWith = _.mergeWith.convert({ immutable: false })

let shouldBlockUpdate = flat => {
  let leaves = Tree.flatLeaves(flat)
  let noUpdates = !_.some('markedForUpdate', leaves)
  let hasErrors = _.some('error', leaves)
  return hasErrors || noUpdates
}

let isStale = (result, target) =>
  target.lastUpdateTime &&
  result.lastUpdateTime &&
  target.lastUpdateTime > result.lastUpdateTime

let defaultService = () => {
  throw new Error('No update service provided!')
}

// Export useful utils which might be needed for extending the core externally
export {
  Tree,
  encode,
  decode,
  exampleTypes,
  hasContext,
  hasValue,
  mockService,
  subquery,
}

export let ContextTree = _.curry(
  (
    {
      service = defaultService,
      types = exampleTypes,
      debounce = 500,
      onResult = _.noop,
      onChange = _.noop,
      onError = F.throws,
      debug,
      disableAutoUpdate,
      extend = F.extendOn,
      snapshot = _.cloneDeep,
      initObject = _.identity,
      log = x => debug && console.info(x),
    },
    tree
  ) => {
    tree = initObject(tree)
    let debugInfo = initObject({ dispatchHistory: [] })
    let customReactors = reactors

    // initNode now generates node keys, so it must be run before flattening the tree
    dedupeWalk(initNode(extend, types), tree)
    let flat = flatten(tree)
    let getNode = path => flat[encode(path)]

    // Overwrite extend to report changes
    extend = _.over([extend, (a, b) => TreeInstance.onChange(a, b)])

    // Getting the Traversals
    let { markForUpdate, markLastUpdate, prepForUpdate } = traversals(extend)

    let processEvent = event => path =>
      _.flow(
        getAffectedNodes(customReactors, getNode, types),
        // Mark children only if it's not a parent of the target so we don't incorrectly mark siblings
        // flatMap because traversing children can create arrays
        _.flatMap(n =>
          F.unless(
            isParent(snapshot(n.path), event.path),
            Tree.toArrayBy
          )(markForUpdate)(n)
        )
      )(event, path)

    // Event Handling
    let dispatch = async event => {
      log(`${event.type} event at ${event.path}`)
      if (debug) debugInfo.dispatchHistory.push(event)
      await validate(runTypeFunction(types, 'validate'), extend, tree)
      let updatedNodes = _.flatten(bubbleUp(processEvent(event), event.path))
      await Promise.all(_.invokeMap('onMarkForUpdate', updatedNodes))
      // Snapshot is for mobx 4 support because path being an obserable array means that `_.find({path: event.path})` throws an error
      let affectsSelf = !!_.flow(
        _.map(snapshot),
        _.find({ path: snapshot(event.path) })
      )(updatedNodes)
      if (!affectsSelf)
        await Promise.all(
          _.map(
            n => runTypeFunction(types, 'onUpdateByOthers', n, extend),
            updatedNodes
          )
        )

      // Skip triggerUpdate if disableAutoUpdate or it this dispatch affects the target node (to allow things like paging changes to always go through)
      // The assumption here is that any event that affects the target node would likely be assumed to take effect immediately by end users
      // Also allow events to specify `autoUpdate:true` to let it through (e.g. search button event)
      // This approach is simpler than marking missedUpdate but not paused, but will trigger _all_ pending updates when an update goes through
      if (!TreeInstance.disableAutoUpdate || affectsSelf || event.autoUpdate) {
        await triggerUpdate()
      }
    }

    let triggerImmediateUpdate = async () => {
      if (shouldBlockUpdate(flat)) return log('Blocked Search')
      let now = new Date().getTime()
      markLastUpdate(now)(tree)
      let dto = serialize(snapshot(tree), { search: true })
      prepForUpdate(tree)
      try {
        await processResponse(await service(dto, now))
      } catch (error) {
        await processResponse(tree)
        onError(error) // Raise the onError event
      }
    }
    let triggerDelayedUpdate = F.debounceAsync(debounce, triggerImmediateUpdate)
    let triggerUpdate = () =>
      TreeInstance.disableAutoUpdate
        ? triggerImmediateUpdate()
        : triggerDelayedUpdate()

    let processResponse = async data => {
      // TODO: Remove these 3 deprecated lines in 3.0. Errors will just be on the tree so no need to wrap in `data` to allow `error`
      data = _.isEmpty(data.data) ? data : data.data
      let { error } = data
      if (error) extend(tree, { error })
      await Promise.all(
        F.mapIndexed(
          (node, path) => processResponseNode(decode(path), node),
          flatten(data)
        )
      )
    }
    let processResponseNode = async (path, node) => {
      let target = flat[encode(path)]
      let responseNode = _.pick(['context', 'error'], node)
      if (target && !isStale(node, target)) {
        if (!_.isEmpty(responseNode)) {
          TreeInstance.onResult(path, node, target)
          mergeWith((oldValue, newValue) => newValue, target, responseNode)
          if (debug && node._meta) target.metaHistory.push(node._meta)
        }
        extend(target, { updating: false })
        try {
          target.updatingDeferred.resolve()
        } catch (e) {
          log(
            'Tried to resolve a node that had no updatingDeferred. This usually means there was unsolicited results from the server for a node that has never been updated.'
          )
        }
        if (!_.isEmpty(responseNode)) {
          await F.maybeCall(target.afterSearch)
        }
      }
    }

    let actionProps = {
      getNode,
      flat,
      dispatch,
      snapshot,
      extend,
      types,
      initNode,
      initObject,
    }

    let TreeInstance = initObject({
      serialize: () => serialize(snapshot(tree), {}),
      tree,
      debugInfo,
      ...actionProps,
      addActions: create => F.extendOn(TreeInstance, create(actionProps)),
      addReactors: create => F.extendOn(customReactors, create()),
      onResult,
      onChange,
      disableAutoUpdate,
      processResponseNode,
    })

    TreeInstance.addActions(actions)
    TreeInstance.lens = lens(TreeInstance)
    TreeInstance.subquery = subquery(types, TreeInstance)
    return TreeInstance
  }
)
export default ContextTree
