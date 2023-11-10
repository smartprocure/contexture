// https://stackoverflow.com/questions/70177601/does-elasticsearch-provide-highlighting-on-copy-to-field-in-their-newer-versio
// https://github.com/elastic/elasticsearch/issues/5172

import _ from 'lodash/fp.js'
import F from 'futil'
import {
  getHighlightFields,
  alignHighlightsWithSourceStructure,
} from './highlight.js'
import { getField } from '../../utils/fields.js'

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
      _source: F.omitBlank({ includes: node.include, excludes: node.exclude }),
      highlight: highlightConfig.enable && {
        pre_tags: [highlightConfig.pre_tag],
        post_tags: [highlightConfig.post_tag],
        number_of_fragments: 0,
        require_field_match: true,
        fields: getHighlightFields(schema, node._meta.relevantFilters),
      },
    })

    const response = await search(body)
    const results = response.hits.hits

    if (highlightConfig.enable) {
      // Not mutating source in the helper function leaves the door open
      // for a configuration flag to control inlining of highlighted
      // results in source
      const fn = alignHighlightsWithSourceStructure(schema, highlightConfig)
      for (const result of results) {
        for (const [field, val] of _.toPairs(fn(result))) {
          F.setOn(field, val, result._source)
        }
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
