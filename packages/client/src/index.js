import _ from 'lodash/fp'
import * as F from 'futil-js'
import { flattenTree, bubbleUp, flatLeaves, encode, decode } from './util/tree'
import { validate } from './validation'
import { getAffectedNodes } from './reactors'
import actions from './actions'
import serialize from './serialize'
import { markForUpdate, markLastUpdate, prepForUpdate } from './traversals'
import { runTypeFunction } from './types'
import { setState } from './state'
import Types from './exampleTypes'

let mergeWith = _.mergeWith.convert({ immutable: false })

let processEvent = extend =>
  F.flurry(
    getAffectedNodes,
    _.each(n => {
      if (!_.some('markedForUpdate', n.children)) markForUpdate(extend)(n)
    })
  )

let shouldBlockUpdate = flat => {
  let leaves = flatLeaves(flat)
  let noUpdates = !_.some('markedForUpdate', leaves)
  let hasErrors = _.some('error', leaves)
  return hasErrors || noUpdates
}

let isStale = (result, target) =>
  target.lastUpdateTime &&
  result.lastUpdateTime &&
  target.lastUpdateTime > result.lastUpdateTime

let stampPaths = extend =>
  F.eachIndexed((node, path) => {
    extend(node, { path: decode(path) })
  })

let defaultService = () => {
  throw new Error('No update service provided!')
}

let callInitTypes = (types, extend) =>
  _.each(node => {
    let init = _.get([node.type, 'init'], types)
    if (_.isFunction(init)) init(node, extend)
  })

export let exampleTypes = Types

export let ContextTree = _.curry(
  (
    {
      service = defaultService,
      types = Types,
      debounce = 1,
      onResult = _.noop,
      debug,
      extend = F.extendOn,
      snapshot = _.cloneDeep,
    },
    tree
  ) => {
    let log = x => debug && console.info(x)
    let flat = flattenTree(tree)
    let getNode = path => flat[encode(path)]

    setState(flat, extend)
    callInitTypes(types, extend)(flat)
    stampPaths(extend)(flat)

    // Event Handling
    let dispatch = async event => {
      log(`${event.type} event at ${event.path}`)
      await validate(runTypeFunction(types, 'validate'), extend, tree)
      bubbleUp(processEvent(extend)(event, getNode, types), event.path)
      await triggerUpdate()
    }

    let triggerUpdate = F.debounceAsync(debounce, async () => {
      if (shouldBlockUpdate(flat)) return log('Blocked Search')
      let now = new Date().getTime()
      markLastUpdate(extend)(now)(tree)
      let dto = serialize(snapshot(tree), { search: true })
      prepForUpdate(extend)(tree)
      processResponse(await service(dto, now))
    })

    let processResponse = ({ data, error }) => {
      F.eachIndexed((node, path) => {
        let target = flat[path]
        let responseNode = _.pick(['context', 'error'], node)
        if (target && !_.isEmpty(responseNode) && !isStale(node, target)) {
          onResult(decode(path), node, target)
          mergeWith((oldValue, newValue) => newValue, target, responseNode)
          extend(target, { updating: false })
        }
      }, flattenTree(data))
      if (error) extend(tree, { error })
    }

    return {
      ...actions({ getNode, flat, dispatch, snapshot, extend }),
      serialize: () => serialize(snapshot(tree), {}),
      dispatch,
      getNode,
      tree,
    }
  }
)
export default ContextTree
