import _ from 'lodash/fp'
import * as F from 'futil-js'
import { mapAsync } from './util/promise'
import { setPath, decodePath } from './util/tree'

export default ({ getNode, flat, dispatch }) => ({
  async add(path, value) {
    let target = getNode(path)
    setPath(value, null, [target])
    target.children.push(value)
    flat[value.path] = value
    return dispatch({ type: 'add', path: decodePath(value.path), value })
  },
  async remove(path) {
    let target = getNode(path)
    let parent = getNode(_.dropRight(1, path))
    _.update('children', _.without(target), parent)
    delete flat[target.path]
    return dispatch({ type: 'remove', path, previous: target })
  },
  async mutate(path, value) {
    let target = getNode(path)
    let previous = _.cloneDeep(_.omit('children', target))
    F.extendOn(target, value)
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
