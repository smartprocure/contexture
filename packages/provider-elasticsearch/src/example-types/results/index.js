import _ from 'lodash/fp.js'
import F from 'futil'
import { getField } from '../../utils/fields.js'
import { getRequestBodyHighlight } from './highlighting/request.js'
import { transformHighlightResponse } from './highlighting/response.js'
import { mergeHighlightsOnSource } from './highlighting/merging.js'

const defaultHighlightConfig = {
  pre_tag: '<b class="search-highlight">',
  post_tag: '</b>',
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

    const highlightConfig = _.defaults(defaultHighlightConfig, node.highlight)

    const body = F.omitBlank({
      from: startRecord,
      size: pageSize,
      sort: { [sortField]: node.sortDir || 'desc' },
      explain: node.explain,
      // Without this, ES7+ stops counting at 10k instead of returning the actual count
      track_total_hits: true,
      highlight:
        highlightConfig.enable &&
        getRequestBodyHighlight(schema, node, highlightConfig),
      _source: F.omitBlank({ includes: node.include, excludes: node.exclude }),
    })

    const response = await search(body)
    const results = response.hits.hits

    if (highlightConfig.enable) {
      for (const hit of results) {
        const highlights = transformHighlightResponse(
          schema,
          highlightConfig,
          hit
        )
        mergeHighlightsOnSource(
          schema,
          highlightConfig,
          hit._source,
          highlights
        )
      }
    }

    return {
      scrollId: response._scroll_id,
      // ES 7+ is total.value, ES 6- is hits.total
      totalRecords: F.getOrReturn('value', response.hits.total),
      startRecord: startRecord + 1,
      endRecord: startRecord + results.length,
      results,
    }
  },
}
