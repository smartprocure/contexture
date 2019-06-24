import _ from 'lodash/fp'
import { DefaultNodeProps as defaultNodeProps } from './schema'

export let oppositeJoin = join => (join === 'and' ? 'or' : 'and')

export let randomString = () =>
  Math.random()
    .toString(36)
    .substring(7)

export let blankNode = () => ({ key: randomString() })

export let newNodeFromType = _.curry((type, fields, node) => ({
  type,
  ..._.pick(['key', 'field'], node),
  ...defaultNodeProps(node.field, fields, type),
}))

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
