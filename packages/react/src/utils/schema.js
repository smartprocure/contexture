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

export let getRecord = F.when('_source', x => ({
  _id: x._id,
  ...x._source,
}))

export let getResults = _.get('context.response.results')

export let inferSchema = _.flow(
  getResults,
  _.head,
  getRecord,
  flattenPlainObject
)

export let DefaultNodeProps = (field, fields, type) =>
  _.get(`${field}.defaultNodeProps.${type}`, fields)