import _ from 'lodash/fp.js'
import F from 'futil'

let getChildren = (x) => F.cascade(['children', 'items', 'data.items'], x)

export let Tree = F.tree(getChildren)

export let getRelevantFilters = _.curry((groupCombinator, Path, group) => {
  if (!_.includes(group.key, Path))
    // If we're not in the path, it doesn't matter what the rest of it is
    Path = []

  let path = Path.slice(1) // pop off this level
  let currentKey = path[0]

  let relevantChildren = getChildren(group)
  // Pull .filter if it's a leaf node
  if (!relevantChildren) return group._meta.filter
  // Exclude sibling criteria in OR groups where the group is in the paths (meaning only exclude ORs that are in relation via path)
  if (group.join === 'or' && currentKey)
    relevantChildren = _.filter({ key: currentKey }, relevantChildren)
  // Exclude self
  relevantChildren = _.reject(
    (node) => node.key === currentKey && !getChildren(node),
    relevantChildren
  )

  let relevantFilters = _.compact(
    _.map(getRelevantFilters(groupCombinator, path), relevantChildren)
  )
  if (!relevantFilters.length) return
  if (relevantFilters.length === 1 && group.join !== 'not')
    return relevantFilters[0]

  return groupCombinator(group, _.compact(relevantFilters))
})

export let getProvider = _.curry(
  (providers, schemas, node) =>
    providers[
      node.provider ||
        _.get('provider', schemas[node.schema]) ||
        F.firstCommonKey(providers, schemas[node.schema])
    ] ||
    F.throws(
      new Error(
        `No Provider found ${node.schema} and was not overridden for ${node.key}`
      )
    )
)

export let runTypeFunction = (config) => async (name, node, search) => {
  let schema = config.getSchema(node.schema)
  let fn = F.cascade(
    [`${node.type}.${name}`, `default.${name}`],
    config.getProvider(node).types,
    _.noop
  )
  try {
    return await (search
      ? fn(node, search, schema, config)
      : fn(node, schema, config))
  } catch (e) {
    // Sometimes we throw strings instead of errors
    const error = _.isString(e) ? new Error(e) : e
    error.cause = {
      contexture: { node },
      ...(_.isString(error.cause) ? { error: error.cause } : error.cause ?? {}),
    }
    throw error
  }
}

let extendAllOn = _.extendAll.convert({ immutable: false })

let initNode = (node, i, [{ schema, _meta: { path = [] } = {} } = {}]) => {
  // Add schema, _meta path and requests
  F.defaultsOn(
    { schema, _meta: { requests: [], path: path.concat([node.key]) } },
    node
  )
  // Flatten legacy fields
  extendAllOn([node, node.config, node.data])
}

export let attachFilters = (runTypeFunction) => async (group) =>
  Tree.walkAsync(async (node, ...args) => {
    initNode(node, ...args)
    node._meta.hasValue = await runTypeFunction('hasValue', node)
    if (node._meta.hasValue && !node.contextOnly) {
      node._meta.filter = await runTypeFunction('filter', node)
    }
  })(group)
