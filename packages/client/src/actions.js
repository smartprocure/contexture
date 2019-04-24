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

  return {
    add,
    remove,
    mutate,
    refresh,
    triggerUpdate,
    clear,
  }
}
