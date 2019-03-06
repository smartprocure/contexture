import _ from 'lodash/fp'
import { pullOn } from 'futil-js'
import { encode } from './util/tree'
import { getTypeProp } from './types'

export default ({
  getNode,
  flat,
  dispatch,
  snapshot,
  types,
  extend,
  initNode,
}) => {
  let add = async (parentPath, node) => {
    let target = getNode(parentPath)
    let path = [...parentPath, node.key]
    // TODO: Does not currently call init on child nodes
    initNode(node, path, extend, types)
    target.children.push(node)
    // Need this nonsense to support the case where push actually mutates, e.g. a mobx observable tree
    flat[encode(path)] = target.children[target.children.length - 1]
    return dispatch({ type: 'add', path, node })
  }

  let remove = async path => {
    let previous = getNode(path)
    let parent = getNode(_.dropRight(1, path))
    pullOn(previous, parent.children)
    delete flat[encode(path)]
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
