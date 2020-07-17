let _ = require('lodash/fp')
let F = require('futil')

let addNodeType = x => {
  let type = x.elasticsearch.dataType
  let hasNested = x.elasticsearch.notAnalyzedField
  let typeDefault = F.alias(type, {
    string: 'query',
    text: hasNested ? 'facet' : 'tagsQuery',
    long: 'number',
    float: 'number',
    scaled_float: 'number',
    double: 'number',
    half_float: 'number',
    byte: 'number',
    short: 'number',
    integer: 'number',
    geo_point: 'geo',
    boolean: 'bool',
  })
  return _.extend(
    {
      typeDefault,
      typeOptions: {
        text: hasNested ? ['facet', 'tagsQuery', 'tagsText', 'exists'] : null,
      }[type] || [typeDefault, 'exists'],
    },
    x
  )
}
let exampleTypeSchemaMapping = _.mapValues(
  _.update('fields', _.mapValues(addNodeType))
)

module.exports = {
  exampleTypeSchemaMapping,
}
