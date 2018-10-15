import _ from 'lodash/fp'
import * as F from 'futil-js'
import { flattenPlainObject } from './futil'

export let applyDefaults = F.mapValuesIndexed((val, field) => ({
  field,
  label: F.autoLabel(field),
  order: 0,
  display: x => F.when(_.get('push'), _.join(', '))(x),
  ...val,
}))

export const getRecord = F.when('_source', x => ({
  _id: x._id,
  ...x._source,
}))

export const getResults = _.get('context.response.results')

export const inferSchema = _.flow(
  getResults,
  _.head,
  getRecord,
  flattenPlainObject
)
