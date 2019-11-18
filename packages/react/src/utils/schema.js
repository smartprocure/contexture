import _ from 'lodash/fp'
import * as F from 'futil'
import { flattenPlainObject } from './futil'

export let applyDefaults = F.mapValuesIndexed((val, field) => ({
  field,
  label: F.autoLabel(field),
  order: 0,
  // `_.get('push') is used instead of `_.isArray` to match mobx4 arrays
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

export let defaultNodeProps = (field, fields, type) =>
  _.get([field, 'defaultNodeProps', type], fields)

export let schemaFieldProps = _.curry((props, { field }, fields) =>
  _.pick(props, fields[field])
)

export let componentForType = TypeMap => ({ type }) =>
  F.whenExists(F.singleObject('component'))(TypeMap[type])

export let fieldsFromSchema = _.curry(
  (schemas, search) => schemas[search.tree.schema].fields
)
