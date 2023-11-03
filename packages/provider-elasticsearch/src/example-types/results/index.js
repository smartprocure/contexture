// https://stackoverflow.com/questions/70177601/does-elasticsearch-provide-highlighting-on-copy-to-field-in-their-newer-versio
// https://github.com/elastic/elasticsearch/issues/5172

import F from 'futil'
import { getHighlightFields } from './highlighting.js'
import { getField } from '../../utils/fields.js'

export default {
  validContext: () => true,
  async result(node, search, schema) {
    const page = (node.page || 1) - 1
    const pageSize = node.pageSize || 10
    const startRecord = page * pageSize
    const sortField = node.sortField
      ? getField(schema, node.sortField)
      : '_score'

    const highlightFields =
      node.enableHighlighting &&
      getHighlightFields(node._meta.relevantFilters, schema)

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
      highlight: highlightFields && {
        pre_tags: ['<b class="search-highlight">'],
        post_tags: ['</b>'],
        number_of_fragments: 0,
        require_field_match: true,
        fields: highlightFields,
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
