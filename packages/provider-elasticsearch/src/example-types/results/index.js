import F from 'futil'
import _ from 'lodash/fp.js'
import {
  inlineSubFieldsMappings,
  makeHighlightConfig,
  mergeHighlightResults,
  inlineHighlightResults,
} from './highlighting.js'
import { getField } from '../../utils/fields.js'

const processResults = (schema, results) => {
  const mappings = _.flow(
    _.mapValues('elasticsearch'),
    F.compactObject
  )(schema.fields)
  return _.map(
    _.flow(mergeHighlightResults(mappings), inlineHighlightResults(mappings)),
    results
  )
}

export default {
  validContext: () => true,
  async result(node, search, schema) {
    const page = (node.page || 1) - 1
    const pageSize = node.pageSize || 10
    const startRecord = page * pageSize
    const sortField = node.sortField
      ? getField(schema, node.sortField)
      : '_score'

    const getHighlightFieldsMappings = _.memoize(() =>
      _.flow(
        _.mapValues('elasticsearch'),
        F.compactObject,
        inlineSubFieldsMappings(schema.elasticsearch.subFields)
      )(schema.fields)
    )

    const body = F.omitBlank({
      from: startRecord,
      size: pageSize,
      sort: { [sortField]: node.sortDir || 'desc' },
      explain: node.explain,
      // Without this, ES7+ stops counting at 10k instead of returning the actual count
      track_total_hits: true,
      _source: F.omitBlank({
        includes: node.include,
        excludes: node.exclude,
      }),
      highlight: node.enableHighlighting && {
        pre_tags: ['<b class="search-highlight">'],
        post_tags: ['</b>'],
        number_of_fragments: 0,
        fields: F.mapValuesIndexed(
          makeHighlightConfig(node._meta.relevantFilters),
          getHighlightFieldsMappings()
        ),
      },
    })

    const response = await search(body)

    return {
      scrollId: response._scroll_id,
      // ES 7+ is total.value, ES 6- is hits.total
      totalRecords: F.getOrReturn('value', response.hits.total),
      startRecord: startRecord + 1,
      endRecord: startRecord + response.hits.hits.length,
      results: response.hits.hits,
    }
  },
}
