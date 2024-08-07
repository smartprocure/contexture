import _ from 'lodash/fp.js'
import F from 'futil'
import { isAtLeastVersion8 } from './compat.js'

let Tree = F.tree((x) => x.properties)
// flatLeaves should auto detect reject vs omit (or just more general obj vs arr method)
let flatten = _.flow(Tree.flatten(), _.omitBy(Tree.traverse))

// A top-level 'properties' prop is es7 default, no types _mapping behavior.
//
// A missing top-level 'properties' prop is es5 and es6 with types
// or es7 using 'GET INDEX/_mapping?include_type_name'.
let extractFieldsAndEsType = (obj) =>
  _.has('properties', obj)
    ? { fields: obj, elasticsearch: {} }
    : _.flow(
        _.toPairs,
        // Capture esType
        ([[type, fields]]) => ({ fields, elasticsearch: { type } })
      )(obj)

let fromEsIndexMapping = (mapping) => {
  let rtn = {}
  for (let prop in mapping) {
    try {
      rtn[prop] = _.flow(
        _.get('mappings'),
        // Always 1 type per index but sometimes there's a `_default_` type thing
        _.omit(['_default_']),
        // filters out 'dynamic_templates' (an array), 'dynamic: true', etc.
        _.pickBy(_.isPlainObject),
        extractFieldsAndEsType,
        _.update(
          'fields',
          _.flow(
            flatten,
            F.mapValuesIndexed((mapping, field) => ({
              field,
              label: _.startCase(field),
              elasticsearch: F.compactObject({
                mapping,
                dataType: mapping.type,
                // Find the child notAnalyzedField to set up facet autocomplete vs word
                notAnalyzedField: _.findKey(
                  { type: 'keyword' },
                  mapping.fields
                ),
              }),
            }))
          )
        )
      )(mapping[prop])
    } catch (e) {
      e.message = `Error processing elastic index mapping '${prop}'\nOriginalError: ${e.message}`
      throw e
    }
  }
  return rtn
}

let copySchemasToAliases = (schemas) =>
  _.flow(
    _.mapValues((x) => _.keys(x.aliases)),
    F.invertByArray,
    // only select field values which are arrays
    _.pickBy(_.isArray),
    // Just takes the first index that matched the alias
    _.mapValues(([x]) => _.merge({ elasticsearch: { aliasOf: x } }, schemas[x]))
  )

export let fromMappingsWithAliases = (mappings, aliases) => {
  // Apparently mappings can sometimes be empty, so omit them to be safe
  let safeMappings = _.omitBy((index) => _.isEmpty(index.mappings), mappings)
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

export let getESSchemas = (client) =>
  Promise.all([client.indices.getMapping(), client.indices.getAlias()]).then(
    ([mappingResult, aliasResult]) => {
      return fromMappingsWithAliases(
        isAtLeastVersion8(client) ? mappingResult : mappingResult.body,
        isAtLeastVersion8(client) ? aliasResult : aliasResult.body
      )
    }
  )
