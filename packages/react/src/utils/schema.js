import _ from 'lodash/fp'
import * as F from 'futil-js'
// For futil
let stampKey = _.curry((key, x) =>
  F.mapValuesIndexed((val, k) => ({ ...val, [key]: k }), x)
)

export let flagFields = _.flow(F.invertByArray, _.mapValues(F.flags))
export let applyDefaults = F.mapValuesIndexed((node, field) =>
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
let flatten = _.flow(Tree.flatten(), _.omitBy(Tree.traverse))
export let fromEsMapping = _.mapValues(
  _.flow(
    _.get('mappings'),
    // Always 1 type per index but sometimes there's a `_default_` type thing
    _.omit(['_default_']),
    _.toPairs,
    // Capture esType
    ([[esType, fields]]) => ({ fields, esType }),
    _.update(
      'fields',
      _.flow(
        flatten,
        _.mapValues(({ type, fields }) => {
          let typeDefault = F.alias(type, {
            string: 'query',
            text: 'facet',
            long: 'number',
            float: 'number',
            double: 'number',
          })
          return {
            typeDefault,
            // TODO: exists, bool, geo, text
            typeOptions: {
              text: ['facet', 'query'],
            }[type] || [typeDefault],
            notAnalyzedField: _.findKey({ type: 'keyword' }, fields),
          }
        }),
        applyDefaults
      )
    ),
    // TODO: Add contexture-elasticsearch support for per field notAnalyzedField
    schema =>
      _.extend(
        {
          notAnalyzedField: firstValue('notAnalyzedField', schema.fields),
        },
        schema
      )
  )
)
export let getESSchemas = client =>
  Promise.all([client.indices.getMapping(), client.indices.getAlias()]).then(
    ([mappings, aliases]) => {
      let schemas = fromEsMapping(mappings)
      return _.flow(
        _.mapValues(x => _.keys(x.aliases)),
        F.invertByArray,
        _.mapValues(([x]) => schemas[x]),
        _.merge(schemas),
        stampKey('esIndex')
      )(aliases)
    }
  )
