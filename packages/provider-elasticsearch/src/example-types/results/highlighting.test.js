import { getHighlightFieldsFromQuery } from './highlighting.js'

describe('getHighlightFieldsFromQuery()', () => {
  it('should extract all fields relevant for highlighting', () => {
    const query = {
      // Full-text queries
      intervals: { 'field:intervals': {} },
      match: { 'field:match': {} },
      match_bool_prefix: { 'field:match_bool_prefix': {} },
      match_phrase: { 'field:match_phrase': {} },
      match_phrase_prefix: { 'field:match_phrase_prefix': {} },
      combined_fields: {
        fields: ['field:combined_fields:0', 'field:combined_fields:1'],
      },
      multi_match: {
        fields: ['field:multi_match:0', 'field:multi_match:1'],
      },
      query_string: {
        fields: ['field:query_string:0', 'field:query_string:1'],
        default_field: 'field:query_string:default',
      },
      simple_query_string: {
        fields: ['field:simple_query_string:0', 'field:simple_query_string:1'],
        default_field: 'field:simple_query_string:default',
      },
      // Term-level queries
      fuzzy: { 'field:fuzzy': {} },
      prefix: { 'field:prefix': {} },
      regexp: { 'field:regexp': {} },
      term: { 'field:term': {} },
      terms: { 'field:terms': {} },
      terms_set: { 'field:terms_set': {} },
      wildcard: { 'field:wildcard': {} },
    }
    expect(getHighlightFieldsFromQuery(query)).toEqual([
      'field:intervals',
      'field:match',
      'field:match_bool_prefix',
      'field:match_phrase',
      'field:match_phrase_prefix',
      'field:combined_fields:0',
      'field:combined_fields:1',
      'field:multi_match:0',
      'field:multi_match:1',
      'field:query_string:0',
      'field:query_string:1',
      'field:query_string:default',
      'field:simple_query_string:0',
      'field:simple_query_string:1',
      'field:simple_query_string:default',
      'field:fuzzy',
      'field:prefix',
      'field:regexp',
      'field:term',
      'field:terms',
      'field:terms_set',
      'field:wildcard',
    ])
  })
})
