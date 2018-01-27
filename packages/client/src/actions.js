import _ from 'lodash/fp'
import { mapAsync } from './util/promise'
import { setPath, encodePath } from './util/tree'
import { pullOn } from 'futil-js'

export default ({ getNode, flat, dispatch, snapshot, extend }) => ({
  async add(parentPath, value) {
    let target = getNode(parentPath)
    let path = [...parentPath, value.key]
    target.children.push(value)
    // flat[value.path] = value
    // Need this nonsense to support the case where push actually mutates, e.g. a mobx observable tree
    flat[encodePath(path)] = target.children[target.children.length - 1]

    return dispatch({ type: 'add', path, value })
  },
  async remove(path) {
    let previous = getNode(path)
    let parent = getNode(_.dropRight(1, path))
    pullOn(previous, parent.children)
    delete flat[encodePath(path)]
    return dispatch({ type: 'remove', path, previous })
  },
  async mutate(path, value) {
    let target = getNode(path)
    let previous = snapshot(_.omit('children', target))
    extend(target, value)
    await mapAsync(
      async (value, type) => dispatch({ type, path, value, previous }),
      value
    )
    return dispatch({
      type: 'mutate',
      path,
      previous,
      value,
      node: target,
      dontProcess: true,
    })
  },
})
