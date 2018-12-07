let _ = require('lodash/fp')
let F = require('futil-js')

let addNodeType = x => {
  let type = x.elasticsearch.dataType
  let hasNested = x.elasticsearch.notAnalyzedField
  let typeDefault = F.alias(type, {
    string: 'query',
    text: hasNested ? 'facet' : 'tagsQuery',
    long: 'number',
    float: 'number',
    double: 'number',
    geo_point: 'geo',
  })
  return _.extend(
    {
      typeDefault,
      // TODO: exists, bool
      typeOptions: {
        text: hasNested ? ['facet', 'tagsQuery'] : null,
      }[type] || [typeDefault],
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
