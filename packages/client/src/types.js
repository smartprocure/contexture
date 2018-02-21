import _ from 'lodash/fp'
import * as F from 'futil-js'

export let getTypeProp = _.curry((types, prop, node) =>
  F.cascade([`${node.type}.${prop}`, `default.${prop}`], types, () => true)
)
export let runTypeFunction = _.curry((types, prop, node, extend) =>
  getTypeProp(types, prop, node)(node, extend)
)
