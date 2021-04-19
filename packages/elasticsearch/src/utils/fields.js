let _ = require('lodash/fp')
let { maybeAppend } = require('./futil')

let dot = x => (x ? `.${x}` : '')

let path = (schema, field) =>
  dot(_.get(['fields', field, 'elasticsearch', 'notAnalyzedField'], schema))

module.exports = {
  getField: (schema, field) => maybeAppend(path(schema, field), field),
  stripLegacySubFields: _.replace('.untouched', ''),
}
