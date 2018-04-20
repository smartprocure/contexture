import _ from 'lodash/fp'
import * as F from 'futil-js'

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

let Tree = F.tree(x => x.properties)
let flatten = _.flow(Tree.flatten(), _.omitBy(Tree.traverse))
export let fromEsMapping = _.mapValues(
  _.flow(
    _.flow(
      _.get('mappings'),
      // Always 1 type per index but sometimes there's a `_default_` type thing
      _.omit(['_default_']),
      _.values,
      _.head,
      flatten
    ),
    _.mapValues(({ type }) => {
      let typeDefault = F.alias(type, {
        string: 'query',
        text: 'facet',
        long: 'number',
        float: 'number',
        double: 'number',
      })
      return {
        typeDefault,
        // TODO: exists, bool, geo, text? //date auto
        typeOptions: {
          text: ['facet', 'query'],
        }[type] || [typeDefault],
      }
    }),
    applyDefaults,
    fields => ({ fields })
  )
)
export let getESSchemas = client =>
  client.indices.getMapping().then(fromEsMapping)
