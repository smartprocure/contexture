let _ = require('lodash/fp')
let F = require('futil-js')

let rawFieldName = _.replace(/(\.untouched)|(\.shingle)/g, '')
let modeMap = {
  word: '',
  autocomplete: 'untouched',
  field: 'untouched',
  suggest: 'shingle',
}
module.exports = {
  getField(schema, field, fieldMode = 'autocomplete') {
    if (schema.getField) return schema.getField(schema, field, fieldMode)

    let fieldName = (schema.rawFieldName || rawFieldName)(field)
    // Maintains backwards compatibility with "modeMap" approach
    let suffix = schema.fields
      ? _.get([fieldName, 'elasticsearch', 'notAnalyzedField'], schema.fields)
      : (schema.modeMap || modeMap)[fieldMode]
    return _.endsWith(suffix, fieldName)
      ? fieldName
      : F.compactJoin('.', [fieldName, suffix])
  },
}
