import _ from 'lodash/fp'
import * as F from 'futil-js'

export let getTypeProp = _.curry((types, prop, node) =>
  node[prop] || F.cascade([`${node.type}.${prop}`, `default.${prop}`], types)
)
export let runTypeFunction = _.curry((types, prop, node, extend) =>
  (getTypeProp(types, prop, node) || _.stubTrue)(node, extend)
)

export let getTypePropOrError = _.curry((types, prop, node) =>
  getTypeProp(types, prop, node) ||
  F.throws(Error(`No '${prop}' found for ${node.type}`))
)