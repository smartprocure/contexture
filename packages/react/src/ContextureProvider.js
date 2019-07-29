import ContextureMobx from './utils/contexture-mobx'

export default ({ types, service, nodeKey, ...args }) =>
  ContextureMobx({ types, service })({
    key: nodeKey || 'root',
    type: 'group',
    children: [],
    ...args,
  })
