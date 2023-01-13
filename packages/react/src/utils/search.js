import F from 'futil'
import _ from 'lodash/fp.js'
import { defaultNodeProps } from './schema.js'

export let oppositeJoin = node =>
  F.getOrReturn('join', node) === 'and' ? 'or' : 'and'

export let randomString = () => Math.random().toString(36).substring(7)

export let blankNode = () => ({ key: randomString() })

export let newNodeFromType = _.curry((type, fields, node) => ({
  type,
  ..._.pick(['key', 'field'], node),
  ...defaultNodeProps(node.field, fields, type),
}))

export let newNodeFromField = ({ field, fields, ...optionalNodeProps }) => {
  let type = _.get([field, 'typeDefault'], fields)
  return {
    type,
    field,
    ...defaultNodeProps(field, fields, type),
    ...optionalNodeProps,
  }
}

export let transformNodeFromField = args => node => ({
  ..._.pick('key', node),
  ...newNodeFromField(args),
})

export let indent = (Tree, parent, node, skipDefaultNode) => {
  // Reactors:
  //   OR -> And, nothing
  //   AND -> OR, others if has value
  //   to/from NOT, others if has value
  let join = (parent || node).join
  let path = _.toArray(node.path)
  let wrapperNode = {
    key: `${node.key}-${join}-group`,
    join: oppositeJoin(join),
  }
  let wrapperPath = [..._.dropRight(1, path), wrapperNode.key]
  Tree.wrapInGroup(path, wrapperNode)
  if (!skipDefaultNode) Tree.add(wrapperPath, blankNode())
  return Tree.getNode(wrapperPath)
}

export let getTypeLabel = (tree, type) =>
  _.getOr(F.autoLabel(type), ['types', type, 'label'], tree)

export let getTypeLabelOptions = _.curry((tree, types) =>
  _.map(type => ({ label: getTypeLabel(tree, type), value: type }), types)
)
