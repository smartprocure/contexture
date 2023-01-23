import _ from 'lodash/fp.js'
import { getField } from '../../utils/fields.js'
import { buildFilter, elasticsearchIntegerMax } from '../../utils/elasticDSL.js'

let buildQuery = (
  { groupField, background, foreground, size = elasticsearchIntegerMax },
  schema
) => ({
  aggs: {
    results: {
      filters: {
        filters: _.mapValues(buildFilter, { background, foreground }),
      },
      aggs: {
        field: { terms: { field: getField(schema, groupField), size } },
      },
    },
  },
})

// NOTE: does not export buildGroupQuery because it doesn't make sense with pivot
export default {
  buildQuery,
  validContext: node => node.groupField && node.foreground && node.background,
  async result(node, search, schema) {
    let response = await search(buildQuery(node, schema))
    let { foreground, background } = _.mapValues(
      ground => _.map('key', ground.field.buckets),
      response.aggregations.results.buckets
    )
    return { results: _.difference(foreground, background) }
  },
}
