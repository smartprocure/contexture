import _ from 'lodash/fp'
import { inject } from 'mobx-react'
export default (
  render,
  { type, reactors, nodeProps = _.keys(reactors) } = {}
) =>
  inject(({ tree: t, node: n }, { tree = t, path, node = n, ...props }) => {
    node = node || tree.getNode(path)

    // Dynamic add
    if (!node && type) {
      let group = props.group || tree.tree.path

      // Lookup if already added
      if (!node && props.nodeKey) node = tree.getNode([...group, props.nodeKey])

      // Add node if missing
      if (!node) {
        let key = props.nodeKey || _.uniqueId(type)
        let newNode = {
          key,
          type,
          ...(props.field && { field: props.field }),
          ..._.pick(nodeProps, props),
        }
        tree.add(group, newNode)
        // Can't be newNode because it's wrapped in observable, and add doesn't return the new node
        node = tree.getNode([...group, key])

        if (!node) throw Error(`Unable to add node ${JSON.stringify(newNode)}`)
      }
    } else if (!node)
      throw Error(`Node not provided, and couldn't find node at ${path}`)

    return { tree, node }
  })(render)
