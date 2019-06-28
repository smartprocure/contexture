import F from 'futil-js'
import _ from 'lodash/fp'
import { DefaultNodeProps as defaultNodeProps } from './schema'

export let oppositeJoin = node =>
  F.getOrReturn('join', node) === 'and' ? 'or' : 'and'

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

// In the future, we will have logic here to handle intelligently updating
// a node's types when its field is mutated. When that happens, we'll also
// need to pass the `fields` schema to look up typeOptions for the current
// and future field. Could also be a node transformer like newNodeFromType
// if we decide to use Tree.replace() for fields instead of Tree.mutate().
export let changeNodeField = (Tree, node, field) => {
  Tree.mutate(node.path, { field })
}

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
