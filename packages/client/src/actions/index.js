import _ from 'lodash/fp'
import F from 'futil-js'
import { encode, Tree } from '../util/tree'
import { getTypeProp } from '../types'
import wrap from './wrap'
// FUTIL // FUTIL // FUTIL // FUTIL // FUTIL //
import { uniqueStringHash } from '../index'
// FUTIL // FUTIL // FUTIL // FUTIL // FUTIL //

let pushOrSpliceOn = (array, item, index) => {
  if (index === undefined) array.push(item)
  else array.splice(index, 0, item)
  return array
}

let arrayDropLast = _.flow(
  _.toArray,
  _.dropRight(1)
)

export default config => {
  let {
    getNode,
    flat,
    dispatch,
    snapshot,
    types,
    extend,
    initNode,
    initObject,
  } = config

  let add = async (parentPath, node, { index } = {}) => {
    let target = getNode(parentPath)
    // initialize uniqueString hash
    let dedupeChildren = uniqueStringHash()
    // populate the dedupe cache for our new node's siblings
    _.flow(
      _.get('children'),
      _.toArray, // mobx
      F.flowMap(_.get('key'), dedupeChildren(parentPath))
    )(target)

    node = initObject(node)
    Tree.walk(
      (node, index, [parent = {}]) => {
        initNode(
          node,
          parent.path || parentPath,
          extend,
          types,
          dedupeChildren(parent.path || parentPath)
        )
        flat[encode(node.path)] = node
      },
      node => {
        dedupeChildren.clear(node.path)
      }
    )(node)

    // consider moving this in the tree walk? it could work for al children too but would be exgra work for chilren
    pushOrSpliceOn(target.children, node, index)
    // Need this nonsense to support the case where push actually mutates, e.g. a mobx observable tree
    // flat[encode(path)] = target.children[index]

    return dispatch({ type: 'add', path: _.toArray(node.path), node })
  }

  let remove = async path => {
    let previous = getNode(path)
    let parentPath = arrayDropLast(path)
    let parent = getNode(parentPath)
    F.pullOn(previous, parent.children)

    Tree.walk((node, index, [parent = {}]) => {
      let path = [...(parent.path || parentPath), node.key]
      delete flat[encode(path)]
    })(previous)

    return dispatch({ type: 'remove', path, previous })
  }

  let mutate = _.curry(async (path, value) => {
    let target = getNode(path)
    let previous = snapshot(_.omit('children', target))
    extend(target, value)
    return dispatch({
      type: 'mutate',
      path,
      previous,
      value,
      node: target,
    })
  })

  let refresh = path => dispatch({ type: 'refresh', path })

  let triggerUpdate = () =>
    dispatch({ type: 'none', path: [], autoUpdate: true })

  let clear = path =>
    mutate(
      path,
      _.omit(['field'], getTypeProp(types, 'defaults', getNode(path)))
    )

  let replace = (path, transform) => {
    let parentPath = arrayDropLast(path)
    let node = getNode(path)
    let index = _.findIndex(x => x === node, getNode(parentPath).children)
    let newNode = F.callOrReturn(transform, node)
    remove(path)
    return add(parentPath, newNode, { index })
  }

  let { wrapInGroup } = wrap(config, { mutate, replace, add })

  let move = (path, { path: targetPath, index: targetIndex } = {}) => {
    let parentPath = arrayDropLast(path)
    targetPath = targetPath || parentPath

    let node = getNode(path)
    if (_.isEqual(parentPath, targetPath)) {
      // Same group, no dispatch or updating of paths needed - just rearrange children
      F.pullOn(node, getNode(parentPath).children)
      pushOrSpliceOn(getNode(targetPath).children, node, targetIndex)
    } else {
      return Promise.all([
        remove(path),
        add(targetPath, node, { index: targetIndex }),
      ])
    }
  }

  let mutateNested = (path, payload) =>
    _.flow(
      getNode,
      Tree.toArrayBy(node => mutate(_.toArray(node.path), payload)),
      x => Promise.all(x)
    )(path)

  let pauseNested = path => mutateNested(path, { paused: true })
  let unpauseNested = path => mutateNested(path, { paused: false })

  let nodeLeaves = _.flow(
    getNode,
    Tree.leaves
  )
  let isPausedNested = _.flow(
    nodeLeaves,
    _.every('paused')
  )

  return {
    add,
    remove,
    mutate,
    refresh,
    triggerUpdate,
    clear,
    replace,
    wrapInGroup,
    move,
    isPausedNested,
    pauseNested,
    unpauseNested,
  }
}
