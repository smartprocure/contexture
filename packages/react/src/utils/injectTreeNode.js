import { inject } from 'mobx-react'
export default inject(
  ({ tree: t1, node: n1 }, { tree = t1, path, node: n2 }) => ({
    tree,
    node: n2 || n1 || tree.getNode(path),
  })
)