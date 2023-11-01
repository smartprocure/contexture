// https://stackoverflow.com/questions/70177601/does-elasticsearch-provide-highlighting-on-copy-to-field-in-their-newer-versio
// https://github.com/elastic/elasticsearch/issues/5172

import _ from 'lodash/fp.js'
import F from 'futil'

// https://www.elastic.co/guide/en/elasticsearch/reference/8.10/query-dsl.html
const foo = new Set([
  // Full-text queries
  'intervals',
  'match',
  'match_bool_prefix',
  'match_phrase',
  'match_phrase_prefix',
  // Term-level queries
  'fuzzy',
  'prefix',
  'regexp',
  'term',
  'terms',
  'terms_set',
  'wildcard',
])

const bar = new Set([
  'query_string',
  'simple_query_string',
  'combined_fields',
  'multi_match',
])

/**
 * Extract fields relevant for highlighting from an Elastic query DSL.
 *
 * This function walks the query, looking for whitelisted keys that correspond
 * to elastic query names such as "fuzzy" and "match". As such, it may return
 * extra fields that do not exist in the index mappings. For example, given the
 * following query
 *
 * ```
 * { "match": { "match": { "query": "city" } } }`
 * ```
 *
 * this function will return `["match", "query"]` which is incorrect as "query"
 * is not a field. This is a reasonable tradeoff to avoid a more comprehensive
 * parser and keep the implementation simple.
 */
export const getHighlightFieldsFromQuery = F.reduceTree()(
  (fields, query, key) => {
    if (_.isPlainObject(query)) {
      if (foo.has(key)) {
        fields.push(..._.keys(query))
      }
      // Use https://github.com/bripkens/lucene if we decide to parse lucene query
      // strings.
      if (bar.has(key)) {
        fields.push(...(query.fields ?? []))
        if (query.default_field) {
          fields.push(query.default_field)
        }
      }
    }
    return fields
  },
  []
)

export const expandFieldWildcards = _.curry(() => [])

// Also expand `FieldGroup.All.exact` into `description.exact`, `title.exact`, etc...
export const expandFieldGroups = _.curry(() => [])

// For each field, produce some default configuration based on the mappings (ex. limiting number of fragments for big text blobs)
//   - Syncing code should set `{ index_options: 'offsets', meta: { subtype: 'bigtext' } }`
export const makeHighlightConfig = _.curry(() => [])

export const mergeHighlightResults = _.curry(() => [])

export const inlineHighlightResults = _.curry(() => [])
