import _ from 'lodash/fp'
import * as F from 'futil-js'
import { flattenTree, bubbleUp, Tree, encode, decode } from './util/tree'
import { validate } from './validation'
import { getAffectedNodes } from './reactors'
import actions from './actions'
import serialize from './serialize'
import traversals from './traversals'
import { runTypeFunction } from './types'
import { initNode } from './node'
import exampleTypes from './exampleTypes'
import lens from './lens'

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

export {
  Tree,
  encode,
  decode,
  exampleTypes
}

export let ContextTree = _.curry(
  (
    {
      service = defaultService,
      types = exampleTypes,
      debounce = 500,
      onResult = _.noop,
      debug,
      extend = F.extendOn,
      onChange = _.noop,
      snapshot = _.cloneDeep,
    },
    tree
  ) => {
    let log = x => debug && console.info(x)
    let flat = flattenTree(tree)
    let getNode = path => flat[encode(path)]

    F.eachIndexed(
      (node, path) => initNode(node, decode(path), extend, types),
      flat
    )

    // overwriting extend
    extend = _.overSome([extend, onChange])

    // Getting the Traversals
    let { markForUpdate, markLastUpdate, prepForUpdate } = traversals(extend)

    let processEvent = F.flurry(
      getAffectedNodes,
      _.each(n => {
        if (!_.some('markedForUpdate', n.children)) markForUpdate(n)
      })
    )

    // Event Handling
    let dispatch = async event => {
      log(`${event.type} event at ${event.path}`)
      await validate(runTypeFunction(types, 'validate'), extend, tree)
      bubbleUp(processEvent(event, getNode, types), event.path)
      await triggerUpdate()
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
          onResult(decode(path), node, target)
          mergeWith((oldValue, newValue) => newValue, target, responseNode)
          extend(target, { updating: false })
        }
      }, flattenTree(data))
    }

    let TreeInstance = {
      serialize: () => serialize(snapshot(tree), {}),
      dispatch,
      getNode,
      tree,
      createActions: x => 
        F.extendOn(
          TreeInstance,
          x({ getNode, flat, dispatch, snapshot, extend, types, initNode })
        )
    }
    TreeInstance.createActions(actions)
    TreeInstance.lens = lens(TreeInstance)
    return TreeInstance
  }
)
export default ContextTree
