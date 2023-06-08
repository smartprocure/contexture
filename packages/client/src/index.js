import _ from 'lodash/fp.js'
import F from 'futil'
import {
  flatten,
  bubbleUp,
  Tree,
  encode,
  decode,
  isParent,
  pathFromParents,
} from './util/tree.js'
import { validate } from './validation.js'
import { getAffectedNodes, reactors } from './reactors.js'
import actions from './actions/index.js'
import serialize from './serialize.js'
import traversals from './traversals.js'
import { runTypeFunction, getTypeProp } from './types.js'
import {
  initNode,
  hasContext,
  hasValue,
  dedupeWalk,
  hasResults,
} from './node.js'
import exampleTypes from './exampleTypes.js'
import lens from './lens.js'
import mockService from './mockService.js'
import subquery from './subquery.js'
import { setupListeners } from './listeners.js'

let shouldBlockUpdate = (tree) => {
  let leaves = Tree.leaves(tree)
  let noUpdates = !tree.markedForUpdate
  let hasErrors = _.some('error', leaves)
  return hasErrors || noUpdates
}

let isStaleResult = (result, target) =>
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
      log = (x) => debug && console.info(x),
    },
    tree
  ) => {
    let TreeInstance
    tree = initObject(tree)
    let debugInfo = initObject({ dispatchHistory: [] })
    let customReactors = reactors

    let getNode = (path) =>
      // empty path returns root with tree lookup, but should be undefined to mimic flat tree
      !_.isEmpty(path) && Tree.lookup(_.drop(1, path), tree)
    //  flat[encode(path)]

    // Overwrite extend to report changes
    extend = _.over([extend, (a, b) => TreeInstance?.onChange(a, b)])

    // Getting the Traversals
    let {
      markForUpdate,
      markLastUpdate,
      prepForUpdate,
      clearUpdate,
      syncMarkedForUpdate,
      syncComputedGroupFields,
    } = traversals(extend)
    let typeProp = getTypeProp(types)

    let processEvent = (event) => (path) =>
      _.flow(
        getAffectedNodes(customReactors, getNode, types),
        // Mark children only if it's not a parent of the target so we don't incorrectly mark siblings
        // flatMap because traversing children can create arrays
        // groups that aren't properly marked here are taken care of by syncMarkedForUpdate right after
        _.flatMap((n) =>
          F.unless(
            isParent(snapshot(n.path), event.path),
            Tree.toArrayBy,
            markForUpdate
          )(n)
        )
      )(event, path)

    // Event Handling
    let dispatch = async (event) => {
      log(`${event.type} event at ${event.path}`)
      if (debug) debugInfo.dispatchHistory.push(event)
      if (event.node)
        // not all dispatches have event.node, e.g. `refresh` with no path
        F.maybeCall(typeProp('onDispatch', event.node), event, actionProps)
      await validate(runTypeFunction(types, 'validate'), actionProps, tree)
      let updatedNodes = [
        // Get updated nodes
        ..._.flatten(bubbleUp(processEvent(event), event.path)),
        // Get nodes updated as a result of the sync
        ...syncMarkedForUpdate(tree),
      ]

      await Promise.all(_.invokeMap('onMarkForUpdate', updatedNodes))
      // Snapshot is for mobx 4 support because path being an observable array means that `_.find({path: event.path})` throws an error
      let affectsSelf = !!_.flow(
        _.map(snapshot),
        _.find({ path: snapshot(event.path) })
      )(updatedNodes)
      if (!affectsSelf)
        await Promise.all(
          _.map((n) => {
            // When updated by others, force replace instead of merge response
            extend(n, { forceReplaceResponse: true })
            runTypeFunction(types, 'onUpdateByOthers', n, actionProps)
          }, updatedNodes)
        )

      // If disableAutoUpdate but this dispatch affects the target node, update *just* that node (to allow things like paging changes to always go through)
      // The assumption here is that any event that affects the target node would likely be assumed to take effect immediately by end users
      if (TreeInstance.disableAutoUpdate && affectsSelf)
        await triggerUpdate(event.path)
      // Otherwise, skip triggerUpdate if disableAutoUpdate but allow events to specify `autoUpdate:true` to let it through (e.g. search button event)
      else if (!TreeInstance.disableAutoUpdate || event.autoUpdate)
        await triggerUpdate()
    }

    // If specifying path, *only* update that path
    let runUpdate = async (path) => {
      if (shouldBlockUpdate(tree)) return log('Blocked Search')
      let now = new Date().getTime()
      let node = getNode(path)

      markLastUpdate(now)(node || tree)
      let body = serialize(snapshot(tree), types, { search: true })
      prepForUpdate(node || tree)
      // With disableAutoUpdate, self updating mutations cause runUpdate to be called for just the affected node, so prepForUpdate won't be called on the whole tree
      // This resets group level fields (and prepForUpdate isn't necessarily safe for the whole tree if other nodes are markedForUpdate but we're only updating one node
      syncComputedGroupFields(['markedForUpdate', 'updating'], tree)

      // make all other nodes filter only
      if (path) {
        Tree.walk((node, index, parents) => {
          let nodePath = pathFromParents(parents, node)
          // marking everything that isn’t the node or it’s children
          if (!_.isEqual(path, nodePath) && !isParent(path, nodePath)) {
            node.filterOnly = true
          }
        })(body)
      }

      try {
        await processResponse(await service(body, now))
      } catch (error) {
        // Clear updating
        Tree.walk((node) => {
          if (node.updating) {
            clearUpdate(node)
            node.updatingDeferred.resolve()
          }
        })(tree)
        onError(error) // Raise the onError event
      }
    }

    // We need to isolate debouncing for different paths.
    // If you refresh root and then unpause a facet,
    // second update will bounce out the root refresh.
    // So using memo for separate de-bouncers.
    let triggerImmediatePathUpdate = _.memoize(() =>
      F.debounceAsync(0, runUpdate)
    )
    let triggerDelayedPathUpdate = _.memoize(() =>
      F.debounceAsync(debounce, runUpdate)
    )

    let triggerUpdate = (path) =>
      (TreeInstance.disableAutoUpdate
        ? triggerImmediatePathUpdate
        : triggerDelayedPathUpdate)(encode(path))(path)

    let processResponse = async (data) => {
      // TODO: Remove these 3 deprecated lines in 3.0. Errors will just be on the tree so no need to wrap in `data` to allow `error`
      data = _.isEmpty(data.data) ? data : data.data
      let { error } = data
      if (error) extend(tree, { error })
      await Tree.walkAsync(async (node, i, parents) =>
        processResponseNode(pathFromParents(parents, node), node)
      )(data)
    }
    let processResponseNode = async (path, node) => {
      let target = getNode(path)
      let responseNode = _.pick(['context', 'error'], node)
      if (target && !isStaleResult(node, target)) {
        if (!_.isEmpty(responseNode)) {
          TreeInstance.onResult(path, node, target)
          if (
            !target.forceReplaceResponse &&
            F.maybeCall(typeProp('shouldMergeResponse', target), target)
          )
            typeProp('mergeResponse', target)(target, responseNode, actionProps)
          else {
            target.forceReplaceResponse = false
            extend(target, responseNode)
          }
          if (debug && node._meta) target.metaHistory.push(node._meta)
        }

        target.hasResults = hasResults(target)

        clearUpdate(target)

        if (!_.isEmpty(responseNode)) {
          try {
            target.updatingDeferred.resolve()
          } catch (e) {
            log(
              'Tried to resolve a node that had no updatingDeferred. This usually means there was unsolicited results from the server for a node that has never been updated.'
            )
          }
          await F.maybeCall(target.afterSearch)
        }
      }
    }

    let actionProps = {
      getNode,
      dispatch,
      extend,
      snapshot,
      types,
      initNode,
      initObject,
      log,
    }
    F.extendOn(
      actionProps,
      _.pick(
        [
          'mutate',
          'refresh',
          'triggerUpdate',
          'clear',
          'isPausedNested',
          'pauseNested',
          'unpauseNested',
        ],
        actions(actionProps)
      )
    )
    // initNode now generates node keys, so it must be run before flattening the tree
    dedupeWalk(initNode(actionProps), tree)
    actionProps.flat = flatten(tree)

    TreeInstance = initObject({
      serialize: (path) =>
        serialize(snapshot(path ? getNode(path) : tree), types, {}),
      tree,
      debugInfo,
      ...actionProps,
      addReactors: (create) => F.extendOn(customReactors, create()),
      onResult,
      onChange,
      disableAutoUpdate,
      processResponseNode,
    })
    setupListeners(TreeInstance)
    TreeInstance.addActions = (create) =>
      F.extendOn(TreeInstance, create(TreeInstance))
    TreeInstance.addActions(actions)
    TreeInstance.lens = lens(TreeInstance)
    TreeInstance.subquery = subquery(types, TreeInstance)

    return TreeInstance
  }
)
export default ContextTree
