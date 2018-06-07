import _ from 'lodash/fp'
import * as F from 'futil-js'
import { flatten, bubbleUp, Tree, encode, decode, isParent } from './util/tree'
import { validate } from './validation'
import { getAffectedNodes } from './reactors'
import actions from './actions'
import serialize from './serialize'
import traversals from './traversals'
import { runTypeFunction } from './types'
import { initNode, hasContext, hasValue } from './node'
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
      debug,
      extend = F.extendOn,
      snapshot = _.cloneDeep,
      disableAutoUpdate,
    },
    tree
  ) => {
    let log = x => debug && console.info(x)
    let flat = flatten(tree)
    let getNode = path => flat[encode(path)]
    let customReactors = {}

    F.eachIndexed(
      (node, path) => initNode(node, decode(path), extend, types),
      flat
    )

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
          F.unless(isParent(n.path, event.path), Tree.toArrayBy)(markForUpdate)(
            n
          )
        )
      )(event, path)

    // Event Handling
    let dispatch = async event => {
      log(`${event.type} event at ${event.path}`)
      await validate(runTypeFunction(types, 'validate'), extend, tree)
      let updatedNodes = _.flatten(bubbleUp(processEvent(event), event.path))
      await Promise.all(_.invokeMap('onMarkForUpdate', updatedNodes))
      let affectsSelf = !!_.find({ path: event.path }, updatedNodes)
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
      if (!TreeInstance.disableAutoUpdate || affectsSelf || event.autoUpdate)
        await triggerUpdate()
      await Promise.all(_.invokeMap('afterSearch', updatedNodes))
    }

    let triggerUpdate = F.debounceAsync(debounce, async () => {
      if (shouldBlockUpdate(flat)) return log('Blocked Search')
      let now = new Date().getTime()
      markLastUpdate(now)(tree)
      let dto = serialize(snapshot(tree), { search: true })
      prepForUpdate(tree)
      processResponse(await service(dto, now))
    })

    let processResponse = data => {
      // TODO: Remove these 3 deprecated lines in 3.0. Errors will just be on the tree so no need to wrap in `data` to allow `error`
      data = _.isEmpty(data.data) ? data : data.data
      let { error } = data
      if (error) extend(tree, { error })

      F.eachIndexed((node, path) => {
        let target = flat[path]
        let responseNode = _.pick(['context', 'error'], node)
        if (target && !_.isEmpty(responseNode) && !isStale(node, target)) {
          TreeInstance.onResult(decode(path), node, target)
          mergeWith((oldValue, newValue) => newValue, target, responseNode)
          extend(target, { updating: false })
          try {
            target.updatingDeferred.resolve()
          } catch (e) {
            log(
              'Tried to resolve a node that had no updatingDeferred. This usually means there was unsolicited results from the server for a node that has never been udpated.'
            )
          }
        }
      }, flatten(data))
    }

    let TreeInstance = {
      serialize: () => serialize(snapshot(tree), {}),
      dispatch,
      getNode,
      tree,
      addActions: create =>
        F.extendOn(
          TreeInstance,
          create({ getNode, flat, dispatch, snapshot, extend, types, initNode })
        ),
      addReactors: create => F.extendOn(customReactors, create()),
      onResult,
      onChange,
      disableAutoUpdate,
    }

    TreeInstance.addActions(actions)
    TreeInstance.lens = lens(TreeInstance)
    TreeInstance.subquery = subquery(types, TreeInstance)
    return TreeInstance
  }
)
export default ContextTree
