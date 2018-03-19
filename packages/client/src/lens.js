import _ from 'lodash/fp'

export default _.curry((tree, path, prop) => ({
  get: () => _.get(prop, tree.getNode(path)),
  set: value => tree.mutate(path, { [prop]: value }),
}))
