let _ = require('lodash/fp')
let rawFieldName = _.replace(/(\.untouched)|(\.shingle)/g)
let modeMap = {
  word: '',
  autocomplete: '.untouched',
  suggest: '.shingle',
}
module.exports = {
  getField: (context, schema) =>
    schema.getField
      ? schema.getField(context, schema)
      : (schema.rawFieldName || rawFieldName)(context.field) +
        (schema.modeMap || modeMap)[context.data.fieldMode || 'autocomplete'],
}
