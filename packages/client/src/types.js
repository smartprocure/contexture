import _ from 'lodash/fp'
import * as F from 'futil-js'

export let getTypeProp = _.curry((types, prop, node) =>
  F.cascade([`${node.type}.${prop}`, `default.${prop}`], types)
)
export let runTypeFunction = _.curry((types, prop, node) =>
  getTypeProp(types, prop, node)(node)
)
