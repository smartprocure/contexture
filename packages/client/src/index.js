import _ from 'lodash/fp'
import * as F from 'futil-js'
import { flattenTree, bubbleUp, flatLeaves, encode } from './util/tree'
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
    let { type, path } = event
    log(`${type} event at ${path}`)
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
      // We may want expose a hook to notify external subscribers that the context has mutated.
      // Something like this existed but was removed here since it was overly complex and unused: https://github.com/smartprocure/contexture-client/pull/10/commits/d025d1119c3f4cf41447a942e8757b0b5fcd0856
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
