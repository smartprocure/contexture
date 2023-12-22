import F from 'futil'
import { getField } from '../../utils/fields.js'
import { searchWithHighlights } from './highlighting/search.js'

export default {
  validContext: () => true,
  async result(node, search, schema) {
    const page = (node.page || 1) - 1
    const pageSize = node.pageSize || 10
    const startRecord = page * pageSize
    const sortField = node.sortField
      ? getField(schema, node.sortField)
      : '_score'

    search = node.highlight?.enable
      ? searchWithHighlights(node, search, schema)
      : search

    const response = await search(
      F.omitBlank({
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
      })
    )

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
