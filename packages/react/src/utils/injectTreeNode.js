import _ from 'lodash/fp'
import {inject} from 'mobx-react'
export default (render, {type, reactors, nodeProps = _.keys(reactors)} = {}) =>
  inject(({tree: t, node: n}, {tree = t, path, node = n, ...props}) => {
    node = node || tree.getNode(path)
    if (!node && props.key) // Check if already added
      node = tree.getNode([...path, props.key])
    if (!node && props.group) {
      let key = props.key || _.uniqueId(type)
      tree.add(props.group, {
        key,
        type,
        ...(props.field && {field: props.field}),
        ..._.pick(nodeProps, props),
      })
      // add doesn't return the node
      node = tree.getNode([...props.group, key])
    }
    return {tree, node}
  })(render)
