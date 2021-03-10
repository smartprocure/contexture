import F from 'futil'
import _ from 'lodash/fp'

let Tree = F.tree(x => x.children)
export let setFilterOnly = Tree.transform(x => { x.filterOnly = true })

// Wraps provided node in a new `and` group, using the first node/tree's schema and key
export let andGroup = (...args) => {
  let children = _.flatten(args)
  let [{ schema, key }] = children
  return { key: `${key}-parent`, type: 'group', join: 'and', schema, children }
}

let lastChild = _.flow(_.get('children'), _.last)

// Wraps a tree in an AND group with the provided node, runs the search, then returns the added node with results
export let runWith = async (service, tree, node) =>
  lastChild(await service(andGroup(setFilterOnly(tree), node)))


export let flattenProp = _.curry((prop, target) =>
  _.flow(F.expandObject(_.get(prop)), _.unset(prop))(target)
)
