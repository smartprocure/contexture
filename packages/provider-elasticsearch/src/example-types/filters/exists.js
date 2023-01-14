import _ from 'lodash/fp.js'
import { not } from '../../utils/elasticDSL.js'

export let hasValue = ({ value }) => _.isBoolean(value)

export let filter = ({ field, value }) => {
  let filter = { exists: { field } }
  return value ? filter : not(filter)
}
