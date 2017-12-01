import _ from 'lodash/fp'
import * as F from 'futil-js'
import {mapAsync} from './util/promise'
import {setPath, decodePath} from './util/tree'

export default ({getNode, flat, dispatch, snapshot }) => ({
  add: async (path, value) => {
    let target = getNode(path)
    setPath(value, null, [target])
    target.children.push(value)
    flat[value.path] = value
    return dispatch({ type: 'add', path: decodePath(value.path), value })
  },
  remove: async path => {
    let target = getNode(path)
    let parent = getNode(_.dropRight(1, path))
    // TODO: Use F.updateOn
    parent.children = _.pull(target, parent.children)
    delete flat[target.path]
    return dispatch({ type: 'remove', path, previous: target })
  },
  mutate: async (path, value) => {
    let target = getNode(path)
    let previous = snapshot(_.omit('children', target))
    F.extendOn(target, value)
    await mapAsync(async (value, type) =>
      dispatch({ type, path, value, previous })
    , value)
    return dispatch({
      type: 'mutate',
      path,
      previous,
      value,
      node: target,
      dontProcess: true
    })
  }
})
