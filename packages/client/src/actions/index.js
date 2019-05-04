import _ from 'lodash/fp'
import { pullOn } from 'futil-js'
import { encode, Tree } from '../util/tree'
import { getTypeProp } from '../types'
import wrap from './wrap'

let pushOrSpliceOn = (array, item, index) => {
  if (index === undefined) array.push(item)
  else array.splice(index, 0, item)
  return array
}

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
    node = initObject(node)
    Tree.walk((node, index, [parent = {}]) => {
      let path = [...(parent.path || parentPath), node.key]
      initNode(node, path, extend, types)
      flat[encode(path)] = node
    })(node)

    let target = getNode(parentPath)

    // consider moving this in the tree walk? it could work for al children too but would be exgra work for chilren
    pushOrSpliceOn(target.children, node, index)
    // Need this nonsense to support the case where push actually mutates, e.g. a mobx observable tree
    // flat[encode(path)] = target.children[index]

    return dispatch({ type: 'add', path: _.toArray(node.path), node })
  }

  let remove = async path => {
    let previous = getNode(path)
    let parentPath = _.dropRight(1, path)
    let parent = getNode(parentPath)
    pullOn(previous, parent.children)

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

  let replace = (path, node) => {
    let parentPath = _.dropRight(1, path)
    let index = _.findIndex(
      x => x === getNode(path),
      getNode(parentPath).children
    )
    remove(path)
    return add(parentPath, node, { index })
  }

  let { wrapInGroup } = wrap(config, { mutate, replace, add })

  let move = (path, { path: targetPath, index: targetIndex } = {}) => {
    let parentPath = _.dropRight(1, path)
    targetPath = targetPath || parentPath

    let node = getNode(path)
    if (_.isEqual(parentPath, targetPath)) {
      // Same group, no dispatch or updating of paths needed - just rearrange children
      pullOn(node, getNode(parentPath).children)
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
      Tree.toArrayBy(node => mutate(node.path.slice(), payload)),
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
