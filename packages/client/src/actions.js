import _ from 'lodash/fp'
import { pullOn } from 'futil-js'
import { encode, Tree } from './util/tree'
import { getTypeProp } from './types'

let pushOrSpliceOn = (array, item, index)  => {
  if (index === undefined) array.push(item)
  else array.splice(index, 0, item)
  return array
}

export default ({
  getNode,
  flat,
  dispatch,
  snapshot,
  types,
  extend,
  initNode,
}) => {
  let add = async (parentPath, node, index) => {
    Tree.walk((node, index, [parent = {}]) => {
      let path = [..._.toArray(parent.path || parentPath), node.key]
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
      let path = [...parent.path || parentPath, node.key]
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
    let index = _.findIndex(getNode(path), getNode(parentPath).children)
    remove(path)
    return add(parentPath, node, index)
  }

  let shallowCloneNode = node => ({
    ...node,
    children: [...node.children]
  })

  // indent in place should make node key be the new key and put root _inside_ the thing
  // like replace/indent, used at root level
  let indentInPlace = async (path, newNode) => {
    // Clone the root node since we'll be modifying it in place in the tree
    let node = shallowCloneNode(getNode(path))

    // Remove all children (they'll be readded at the end when we add the shallow clone)
    await Promise.all(_.map(child => remove(child.path), node.children))
    
    // Mutate existing root into new root
    await mutate(path, {
      ...newNode,
      path: [newNode.key]
    })
    
    // Replace flat tree references to root
    flat[encode([newNode.key])] = flat[encode(path)]
    delete flat[encode(path)]
    
    // Add original root as a child of the new root
    await add([newNode.key], node)
  }
  let indentReplace = async (path, newNode) =>
    replace(path, {
      ...newNode,
      children: [getNode(path)]
    })

  let indent = async (path, newNode) =>
    _.size(path) > 1
      ? indentReplace(path, newNode)
      : indentInPlace(path, newNode)

  let move = (path, { path: targetPath, index: targetIndex } = {}) => {
    let parentPath = _.dropRight(1, path)
    targetPath = targetPath || parentPath
    
    let node = getNode(path)
    if (_.isEqual(parentPath, targetPath)) {
      // Same group, no dispatch or updating of paths needed - just rearrange children
      pullOn(node, getNode(parentPath).children)
      pushOrSpliceOn(getNode(targetPath).children, node, targetIndex)
    }
    else {
      return Promise.all([
        remove(path),
        add(targetPath, node, targetIndex)
      ])
    }
  }

  return {
    add,
    remove,
    mutate,
    refresh,
    triggerUpdate,
    clear,
    replace,
    indentInPlace,
    indentReplace,
    indent,
    move,
  }
}
