import _ from 'lodash/fp'
import { inlineSubFieldsMappings, makeHighlightConfig } from './highlighting.js'

describe('inlineSubFieldsMappings()', () => {
  it('should inline sub-fields into the top-level mappings', () => {
    const subFields = {
      keyword: { shouldHighlight: false },
      exact: { shouldHighlight: true },
    }
    const mappings = {
      all: {
        type: 'text',
      },
      fieldgroup: {
        type: 'text',
      },
      age: {
        type: 'long',
        copy_to: [],
      },
      name: {
        type: 'text',
        copy_to: ['all', 'fieldgroup'],
      },
      job: {
        type: 'text',
        copy_to: [],
        fields: {
          keyword: { type: 'keyword' },
          exact: { type: 'text', analyzer: 'exact' },
        },
      },
      street: {
        type: 'text',
        copy_to: ['all', 'fieldgroup'],
        fields: {
          keyword: { type: 'keyword' },
          exact: { type: 'text', analyzer: 'exact' },
        },
        meta: { subType: 'blob' },
      },
    }
    expect(inlineSubFieldsMappings(subFields, mappings)).toEqual({
      ..._.omit(['all', 'fieldgroup'], mappings),
      'job.exact': {
        type: 'text',
        analyzer: 'exact',
        copy_to: [],
        meta: { isSubField: true },
      },
      'street.exact': {
        type: 'text',
        analyzer: 'exact',
        copy_to: ['all.exact', 'fieldgroup.exact'],
        meta: { subType: 'blob', isSubField: true },
      },
    })
  })
})

describe('makeHighlightConfig()', () => {
  it('should generate default config for blob subtype', () => {
    const query = {}
    const fieldMapping = {
      meta: { subType: 'blob' },
    }
    const fieldName = 'street'
    const result = makeHighlightConfig(query, fieldMapping, fieldName)
    expect(result).toEqual({
      order: 'score',
      fragment_size: 250,
      number_of_fragments: 3,
    })
  })

  it('should generate highlight_query with field group name replaced by field name', () => {
    const query = {
      bool: {
        must: [
          { terms: { all: 'city' } },
          { terms: { fieldgroup: 'city' } },
          { query_string: { query: 'city', default_field: 'all' } },
          { query_string: { query: 'city', default_field: 'fieldgroup' } },
        ],
      },
    }
    const fieldMapping = {
      copy_to: ['all', 'fieldgroup'],
    }
    const fieldName = 'street'
    const result = makeHighlightConfig(query, fieldMapping, fieldName)
    expect(result).toEqual({
      highlight_query: {
        bool: {
          must: [
            { terms: { [fieldName]: 'city' } },
            { terms: { [fieldName]: 'city' } },
            { query_string: { query: 'city', default_field: fieldName } },
            { query_string: { query: 'city', default_field: fieldName } },
          ],
        },
      },
    })
  })

  it('should not generate highlight_query when field group name is not in query', () => {
    const query = {
      bool: {
        must: [
          { terms: { age: 'city' } },
          { terms: { name: 'city' } },
          { query_string: { query: 'city', default_field: 'age' } },
          { query_string: { query: 'city', default_field: 'name' } },
        ],
      },
    }
    const fieldMapping = {
      copy_to: ['all', 'fieldgroup'],
    }
    const fieldName = 'street'
    const result = makeHighlightConfig(query, fieldMapping, fieldName)
    expect(result).toEqual({})
  })
})

// describe('getHighlightFieldsFromQuery()', () => {
//   it('should extract all fields relevant for highlighting', () => {
//     const query = {
//       // Full-text queries
//       intervals: { 'field:intervals': {} },
//       match: { 'field:match': {} },
//       match_bool_prefix: { 'field:match_bool_prefix': {} },
//       match_phrase: { 'field:match_phrase': {} },
//       match_phrase_prefix: { 'field:match_phrase_prefix': {} },
//       combined_fields: {
//         fields: ['field:combined_fields:0', 'field:combined_fields:1'],
//       },
//       multi_match: {
//         fields: ['field:multi_match:0', 'field:multi_match:1'],
//       },
//       query_string: {
//         fields: ['field:query_string:0', 'field:query_string:1'],
//         default_field: 'field:query_string:default',
//       },
//       simple_query_string: {
//         fields: ['field:simple_query_string:0', 'field:simple_query_string:1'],
//         default_field: 'field:simple_query_string:default',
//       },
//       // Term-level queries
//       fuzzy: { 'field:fuzzy': {} },
//       prefix: { 'field:prefix': {} },
//       regexp: { 'field:regexp': {} },
//       term: { 'field:term': {} },
//       terms: { 'field:terms': {} },
//       terms_set: { 'field:terms_set': {} },
//       wildcard: { 'field:wildcard': {} },
//     }
//     expect(getHighlightFieldsFromQuery(query)).toEqual([
//       'field:intervals',
//       'field:match',
//       'field:match_bool_prefix',
//       'field:match_phrase',
//       'field:match_phrase_prefix',
//       'field:combined_fields:0',
//       'field:combined_fields:1',
//       'field:multi_match:0',
//       'field:multi_match:1',
//       'field:query_string:0',
//       'field:query_string:1',
//       'field:query_string:default',
//       'field:simple_query_string:0',
//       'field:simple_query_string:1',
//       'field:simple_query_string:default',
//       'field:fuzzy',
//       'field:prefix',
//       'field:regexp',
//       'field:term',
//       'field:terms',
//       'field:terms_set',
//       'field:wildcard',
//     ])
//   })
// })
