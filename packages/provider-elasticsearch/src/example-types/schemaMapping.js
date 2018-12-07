let _ = require('lodash/fp')
let F = require('futil-js')

let addNodeType = x => {
  let type = x.elasticsearch.dataType
  let typeDefault = F.alias(type, {
    string: 'query',
    text: 'facet',
    long: 'number',
    float: 'number',
    double: 'number',
    geo_point: 'geo',
  })
  return _.extend(
    {
      typeDefault,
      // TODO: exists, bool, geo, text
      typeOptions: {
        text: ['facet', 'query'],
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
