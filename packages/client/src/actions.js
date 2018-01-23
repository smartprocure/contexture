import _ from 'lodash/fp'
import { mapAsync } from './util/promise'
import { setPath, decodePath } from './util/tree'
import { pullOn } from './util/futil'

export default ({ getNode, flat, dispatch, snapshot, extend }) => ({
  async add(path, value) {
    let target = getNode(path)
    setPath(value, null, [target])
    target.children.push(value)
    // flat[value.path] = value
    // Need this nonsense to support the case where push actually mutates, e.g. a mobx observable tree
    flat[value.path] = target.children[target.children.length - 1]

    return dispatch({ type: 'add', path: decodePath(value.path), value })
  },
  async remove(path) {
    let previous = getNode(path)
    let parent = getNode(_.dropRight(1, path))
    pullOn(previous, parent.children)
    delete flat[previous.path]
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
