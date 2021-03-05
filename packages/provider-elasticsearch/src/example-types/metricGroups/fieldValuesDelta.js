let _ = require('lodash/fp')
let { getField } = require('../../utils/fields')
let { buildFilter, elasticsearchIntegerMax } = require('../../utils/elasticDSL')

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

module.exports = {
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
