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
export let fromFlatEsMapping = _.mapValues(
  _.flow(
    // Always 1 type per index
    x => _.values(x.mappings)[0].properties,
    _.mapValues(({ type }) => ({
      typeDefault: F.alias(type, {
        string: 'query',
        text: 'facet',
        long: 'number',
        float: 'number',
        double: 'number',
      }),
      // TODO: exists, bool, date, geo, text?
      typeOptions: {
        string: ['query'],
        text: ['facet', 'query'],
        long: ['number'],
        float: ['number'],
        double: ['number'],
      }[type],
    })),
    applyDefaults,
    fields => ({ fields })
  )
)
export let getESSchemas = client =>
  client.indices.getMapping().then(fromFlatEsMapping)
