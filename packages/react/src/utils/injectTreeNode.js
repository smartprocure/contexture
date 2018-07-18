import _ from 'lodash/fp'
import { injectDefaults } from './mobx-react-utils'
import StripedLoader from './StripedLoader'
import { autoKey } from './dsl'

export default (
  render,
  {
    type,
    reactors,
    nodeProps = _.keys(reactors),
    loadingAware = false,
    style,
  } = {}
) =>
  injectDefaults(({ tree, node, group, path, ...props }) => {
    node = node || tree.getNode(path)

    // Not Found
    if (!node && path) throw Error(`Node not found at ${path}`)

    // Dynamic add
    if (!node && type) {
      let key = props.nodeKey || autoKey({ type, ...props })
      group = group || _.get('tree.path', tree)

      // Lookup if already added
      if (!node) node = tree.getNode([...group, key])

      // Add node if missing
      if (!node) {
        let newNode = {
          key,
          type,
          ..._.pick(['field', ...nodeProps], props),
        }
        tree.add(group, newNode)
        // Can't be newNode because it's wrapped in observable, and add doesn't return the new node
        node = tree.getNode([...group, key])

        if (!node) throw Error(`Unable to add node ${JSON.stringify(newNode)}`)
      }
    } else if (!node)
      throw Error(`Node not provided, and couldn't find node at ${path}`)

    return {
      tree,
      node,
      ...(loadingAware
        ? {}
        : { loading: node.markedForUpdate || node.updating }),
    }
  })(StripedLoader(render, style))
