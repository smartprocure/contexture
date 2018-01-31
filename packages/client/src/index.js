import _ from 'lodash/fp'
import * as F from 'futil-js'
import { flattenTree, bubbleUp, flatLeaves, encode, decode } from './util/tree'
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

let shouldDropUpdate = (result, target) =>
  target.lastUpdateTime &&
  result.lastUpdateTime &&
  target.lastUpdateTime > result.lastUpdateTime

export let ContextTree = _.curry(({ service = () => {
    throw new Error('No update service provided!')
  }, types = exampleTypes, debounce = 1, onResult = _.noop, allowBlank, debug, extend = F.extendOn, snapshot = _.cloneDeep }, tree) => {
  //= true
  let log = x => debug && console.info(x)
  let flat = flattenTree(tree)
  F.eachIndexed((node, path) => {
    node.path = decode(path)
  }, flat)
  let getNode = path => flat[encode(path)]

  // Event Handling
  let dispatch = async event => {
    log(`${event.type} event at ${event.path}`)
    await validate(runTypeFunction(types, 'validate'), extend, tree)
    bubbleUp(processEvent(event, getNode, types), event.path)
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
      if (!shouldDropUpdate(node, target) && !_.isEmpty(responseNode)) {
        onResult(decode(path), node, target)
        F.mergeOn(target, responseNode)
        target.updating = false
      }
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
})
export default ContextTree
