let _ = require('lodash/fp')
let F = require('futil-js')

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
    ([[type, fields]]) => ({ fields, elasticsearch: { type } }),
    _.update(
      'fields',
      _.flow(
        flatten,
        _.mapValues(({ type, fields }) => ({
          elasticsearch: F.compactObject({
            dataType: type,
            // Find the child notAnalyzedField to set up facet autocomplete vs word
            notAnalyzedField: _.findKey({ type: 'keyword' }, fields),
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

let copySchemasToAliases = schemas =>
  _.flow(
    _.mapValues(x => _.keys(x.aliases)),
    F.invertByArray,
    // only select field values which are arrays
    _.pickBy(_.isArray),
    // Just takes the first index that matched the alias
    _.mapValues(([x]) => schemas[x])
  )

let fromMappingsWithAliases = (mappings, aliases) => {
  // Apparently mappings can sometimes be empty, so omit them to be safe
  let safeMappings = _.omitBy(index => _.isEmpty(index.mappings), mappings)
  let schemas = fromEsIndexMapping(safeMappings)
  return _.flow(
    copySchemasToAliases(schemas),
    _.merge(schemas),
    // Apply indexes at the end so aliases don't get indexes for the non aliased mappings
    F.mapValuesIndexed((val, index) =>
      _.merge({ elasticsearch: { index } }, val)
    )
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
