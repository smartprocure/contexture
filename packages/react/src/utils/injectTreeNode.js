import _ from 'lodash/fp'
import { injectDefaults } from './mobx-react-utils'
import StripedLoader from './StripedLoader'

export default (
  render,
  { type, reactors, nodeProps = _.keys(reactors), loadingAware = false } = {}
) =>
  injectDefaults(({ tree, node, group, path, ...props }) => {
    node = node || tree.getNode(path)

    // Dynamic add
    if (!node && type) {
      group = group || _.get('tree.path', tree)

      // Lookup if already added
      if (!node && props.nodeKey) node = tree.getNode([...group, props.nodeKey])

      // Add node if missing
      if (!node) {
        let key = props.nodeKey || _.uniqueId(type)
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
  })(StripedLoader(render))
