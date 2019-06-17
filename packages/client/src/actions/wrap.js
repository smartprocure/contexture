import _ from 'lodash/fp'
import { encode } from '../util/tree'

let shallowCloneNode = node => ({
  ...node,
  children: [...node.children],
})

export default ({ getNode, flat }, { mutate, replace, remove, add }) => {
  // wrapInGroup in place should make node key be the new key and put root _inside_ the thing
  // like replace/wrapInGroup, used at root level
  let wrapInGroupInPlace = async (path, newNode) => {
    // Clone the root node since we'll be modifying it in place in the tree
    let node = shallowCloneNode(getNode(path))

    // Remove all children (they'll be readded at the end when we add the shallow clone)
    await Promise.all(_.map(child => remove(child.path), node.children))

    // Mutate existing root into new root
    await mutate(path, {
      ...newNode,
      path: [newNode.key],
    })

    // Replace flat tree references to root
    flat[encode([newNode.key])] = flat[encode(path)]
    delete flat[encode(path)]

    // Add original root as a child of the new root
    await add([newNode.key], node)
  }
  let wrapInGroupReplace = async (path, newNode) =>
    replace(path, {
      ...newNode,
      children: [getNode(path)],
    })

  let wrapInGroup = async (path, newNode) =>
    _.size(path) > 1
      ? wrapInGroupReplace(path, newNode)
      : wrapInGroupInPlace(path, newNode)

  return {
    wrapInGroupInPlace,
    wrapInGroupReplace,
    wrapInGroup,
  }
}
