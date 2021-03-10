import _ from 'lodash/fp'
import F from 'futil'

export let flattenProp = _.curry((prop, target) =>
  _.flow(F.expandObject(_.get(prop)), _.unset(prop))(target)
)
