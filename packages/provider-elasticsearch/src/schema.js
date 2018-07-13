let _ = require('lodash/fp')
let F = require('futil-js')

let flagFields = _.flow(
  F.invertByArray,
  _.mapValues(F.flags)
)
let applyDefaults = F.mapValuesIndexed((node, field) =>
  _.defaults(
    {
      field,
      label: F.autoLabel(field),
      order: 0,
    },
    node
  )
)

let firstValue = _.curry((field, data) => _.get(field, _.find(field, data)))

let Tree = F.tree(x => x.properties)
// flatLeaves should auto detect reject vs omit (or just more general obj vs arr method)
let flatten = _.flow(
  Tree.flatten(),
  _.omitBy(Tree.traverse)
)

let fromEsIndexMapping = _.mapValues(
  _.flow(
    _.get('mappings'),
    // Always 1 type per index but sometimes there's a `_default_` type thing
    _.omit(['_default_']),
    _.toPairs,
    // Capture esType
    ([[type, fields]]) => ({fields, elasticsearch: {type}}),
    _.update(
      'fields',
      _.flow(
        flatten,
        _.mapValues(({type, fields}) => ({
          elasticsearch: F.compactObject({
            dataType: type,
            // Find the child notAnalyzedField to set up facet autocomplete vs word
            notAnalyzedField: _.findKey({type: 'keyword'}, fields),
          }),
        })),
        applyDefaults
      )
    ),
    // TODO: Add contexture-elasticsearch support for per field notAnalyzedField
    // In the mean time, this will set the subfields used by things like facet autpcomplete for each index as a whole
    schema =>
      _.extend(
        {
          modeMap: {
            word: '',
            autocomplete: `.${firstValue(
              'elasticsearch.notAnalyzedField',
              schema.fields
            )}`,
          },
        },
        schema
      )
  )
)

let fromMappingsWithAliases = (mappings, aliases) => {
  let schemas = fromEsIndexMapping(mappings)
  return _.flow(
    _.mapValues(x => _.keys(x.aliases)),
    F.invertByArray,
    _.mapValues(([x]) => schemas[x]),
    _.merge(schemas),
    F.mapValuesIndexed((val, index) => _.merge({elasticsearch: {index}}, val))
  )(aliases)
}


let getESSchemas = client =>
  Promise.all([client.indices.getMapping(), client.indices.getAlias()]).then(
    ([mappings, aliases]) => fromMappingsWithAliases(mappings, aliases)
  )
  

module.exports = {
  // flagFields,
  // applyDefaults,
  // fromEsIndexMapping,
  fromMappingsWithAliases,
  getESSchemas,
}