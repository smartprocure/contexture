import _ from 'lodash/fp.js'
import F from 'futil'

// Gets type a specific property from any of the places it might be - on the type in `types` or already on the node itself
export let getTypeProp = _.curry(
  (types, prop, node) => node[prop] || _.get(`${node.type}.${prop}`, types)
)

// Same as getTypeProp, but throws instead of returning undefined if it's missing
export let getTypePropOrError = _.curry(
  (types, prop, node) =>
    getTypeProp(types, prop, node) ||
    F.throws(Error(`No '${prop}' found for ${node.type}`))
)

export let runTypeFunctionOrDefault = _.curry(
  (defaultFn, types, prop, node, actions) =>
    (getTypeProp(types, prop, node) || defaultFn)(node, actions)
)

export let runTypeFunction = runTypeFunctionOrDefault(_.stubTrue)
