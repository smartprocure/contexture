import _ from 'lodash/fp'
import * as F from 'futil-js'
import { DefaultNodeProps as defaultNodeProps } from './schema'
import { oppositeJoin } from './search'

export let traverse = x => x && x.children && _.toArray(x.children) // mobx needs slice
export let keyPath = key => (_.isString(key) ? { key } : key)
export default F.tree(traverse, keyPath)

export let randomString = () =>
  Math.random()
    .toString(36)
    .substring(7)

export let blankNode = () => ({ key: randomString() })

// would also work as a "node transformer", etc -> node -> newNode,
// for use in a hypothetical `transformReplace` contexture action:
// (transform, node) -> replace(node.path, transform(node))
export let newNodeFromType = _.curry(
  (type, fields, node) => ({
    type,
    ..._.pick(['key', 'field'], node),
    ...defaultNodeProps(node.field, fields, type),
  })
)

export let indent = (Tree, parent, node, skipDefaultNode) => {
  // Reactors:
  //   OR -> And, nothing
  //   AND -> OR, others if has value
  //   to/from NOT, others if has value
  let key = randomString()
  Tree.wrapInGroup(_.toArray(node.path), {
    key,
    join: oppositeJoin((parent || node).join),
  })
  if (!skipDefaultNode)
    Tree.add(parent ? [...parent.path, key] : [key], blankNode())
  return Tree.getNode([...parent.path, key])
}
