let _ = require('lodash/fp')
let F = require('futil')

let Tree = F.tree(x => x.properties)
// flatLeaves should auto detect reject vs omit (or just more general obj vs arr method)
let flatten = _.flow(Tree.flatten(), _.omitBy(Tree.traverse))

let fromEsIndexMapping = _.mapValues(
  _.flow(
    _.get('mappings'),
    // Always 1 type per index but sometimes there's a `_default_` type thing
    _.omit(['_default_']),
    x =>
      _.size(_.keys(x)) === 1
        ? // 1 key implies es6 and below with types
          _.flow(
            _.toPairs,
            // Capture esType
            ([[type, fields]]) => ({ fields, elasticsearch: { type } })
          )(x)
        : // More than one key seems like no types (es7+)
          { fields: x, elasticsearch: {} },
    _.update(
      'fields',
      _.flow(
        flatten,
        F.mapValuesIndexed(({ type, fields }, field) => ({
          field,
          label: _.startCase(field),
          elasticsearch: F.compactObject({
            dataType: type,
            // Find the child notAnalyzedField to set up facet autocomplete vs word
            notAnalyzedField: _.findKey({ type: 'keyword' }, fields),
          }),
        }))
      )
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
  Promise.all([
    client.indices.getMapping(),
    client.indices.getAlias(),
  ]).then(([{ body: mappings }, { body: aliases }]) =>
    fromMappingsWithAliases(mappings, aliases)
  )

module.exports = {
  // flagFields,
  // applyDefaults,
  // fromEsIndexMapping,
  fromMappingsWithAliases,
  getESSchemas,
}
