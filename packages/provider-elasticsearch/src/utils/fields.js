import _ from 'lodash/fp.js'
import { maybeAppend } from './futil.js'

let dot = x => (x ? `.${x}` : '')

let path = (schema, field) =>
  dot(_.get(['fields', field, 'elasticsearch', 'notAnalyzedField'], schema))

export let getField = _.curry((schema, field) =>
  maybeAppend(path(schema, field), field)
)

export let stripLegacySubFields = _.replace('.untouched', '')
