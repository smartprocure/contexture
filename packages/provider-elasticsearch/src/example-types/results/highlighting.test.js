import {
  getHighlightFields,
  mergeHighlights,
  inlineHighlightResults,
} from './highlighting.js'

describe('getHighlightFields()', () => {
  it('should exclude fields without mappings', () => {
    const actual = getHighlightFields(
      {
        fields: {
          other: {},
          state: { elasticsearch: {} },
          'city.street': { elasticsearch: {} },
        },
      },
      {}
    )
    const expected = {
      state: {},
      'city.street': {},
    }
    expect(actual).toEqual(expected)
  })

  it('should exclude group fields', () => {
    const actual = getHighlightFields(
      {
        fields: {
          all: { elasticsearch: {} },
          address: { elasticsearch: {} },
          state: { elasticsearch: { copy_to: ['all', 'address'] } },
          'city.street': { elasticsearch: { copy_to: ['all', 'address'] } },
        },
      },
      {}
    )
    const expected = {
      state: {},
      'city.street': {},
    }
    expect(actual).toEqual(expected)
  })

  it('should include whitelisted sub fields', () => {
    const actual = getHighlightFields(
      {
        elasticsearch: {
          subFields: {
            keyword: { shouldHighlight: false },
            exact: { shouldHighlight: true },
          },
        },
        fields: {
          state: {
            elasticsearch: {
              fields: { keyword: {}, exact: {} },
            },
          },
          'city.street': {
            elasticsearch: {
              fields: { keyword: {}, exact: {} },
            },
          },
        },
      },
      {}
    )
    const expected = {
      state: {},
      'state.exact': {},
      'city.street': {},
      'city.street.exact': {},
    }
    expect(actual).toEqual(expected)
  })

  it('should generate configuration for blob text fields', () => {
    const actual = getHighlightFields(
      {
        elasticsearch: {
          subFields: {
            exact: { shouldHighlight: true },
          },
        },
        fields: {
          state: {
            elasticsearch: {
              meta: { subType: 'blob' },
              fields: { exact: {} },
            },
          },
        },
      },
      {}
    )
    const expected = {
      state: {
        fragment_size: 250,
        number_of_fragments: 3,
      },
      'state.exact': {
        fragment_size: 250,
        number_of_fragments: 3,
      },
    }
    expect(actual).toEqual(expected)
  })

  it('should generate highlight_query with field groups replaced', () => {
    const queryWith = (field) => ({
      bool: {
        must: [
          { terms: { [field]: 'memphis' } },
          { query_string: { query: 'memphis', default_field: field } },
        ],
      },
    })
    const actual = getHighlightFields(
      {
        fields: {
          address: { elasticsearch: {} },
          state: { elasticsearch: { copy_to: ['address'] } },
          'city.street': { elasticsearch: { copy_to: ['address'] } },
        },
      },
      queryWith('address')
    )
    const expected = {
      state: {
        highlight_query: queryWith('state'),
      },
      'city.street': {
        highlight_query: queryWith('city.street'),
      },
    }
    expect(actual).toEqual(expected)
  })

  it('should generate highlight_query with field groups replaced for sub fields', () => {
    const queryWith = (field) => ({
      bool: {
        must: [
          { terms: { [field]: 'memphis' } },
          { query_string: { query: 'memphis', default_field: field } },
        ],
      },
    })
    const actual = getHighlightFields(
      {
        elasticsearch: {
          subFields: {
            exact: { shouldHighlight: true },
          },
        },
        fields: {
          address: {
            elasticsearch: {},
          },
          state: {
            elasticsearch: {
              copy_to: ['address'],
              fields: { exact: {} },
            },
          },
          'city.street': {
            elasticsearch: {
              copy_to: ['address'],
              fields: { exact: {} },
            },
          },
        },
      },
      queryWith('address.exact')
    )
    const expected = {
      state: {},
      'state.exact': { highlight_query: queryWith('state.exact') },
      'city.street': {},
      'city.street.exact': { highlight_query: queryWith('city.street.exact') },
    }
    expect(actual).toEqual(expected)
  })
})

describe('mergeHighlights()', () => {
  const merge = mergeHighlights({ pre: '<em>', post: '</em>' })

  it('should merge highlights that do not overlap', () => {
    const actual = merge([
      'The <em>quick</em> brown fox jumps over the lazy dog',
      'The quick brown <em>fox jumps</em> over the lazy dog',
    ])
    const expected =
      'The <em>quick</em> brown <em>fox jumps</em> over the lazy dog'
    expect(actual).toEqual(expected)
  })

  it('should merge highlights that overlap', () => {
    const actual = merge([
      'The quick brown fox <em>jumps over</em> the lazy dog',
      'The quick brown <em>fox jumps</em> over the lazy dog',
    ])
    const expected = 'The quick brown <em>fox jumps over</em> the lazy dog'
    expect(actual).toEqual(expected)
  })

  it('should merge highlights that are contained within another', () => {
    const actual = merge([
      'The quick brown fox <em>jumps</em> over the lazy dog',
      'The quick brown <em>fox jumps over</em> the lazy dog',
    ])
    const expected = 'The quick brown <em>fox jumps over</em> the lazy dog'
    expect(actual).toEqual(expected)
  })

  it('should merge highlights at the end of the string', () => {
    const actual = merge([
      'The quick brown fox <em>jumps</em> over the lazy dog',
      'The quick brown fox jumps over the lazy <em>dog</em>',
    ])
    const expected =
      'The quick brown fox <em>jumps</em> over the lazy <em>dog</em>'
    expect(actual).toEqual(expected)
  })
})

describe('inlineHighlightResults()', () => {
  it('works', () => {
    const hit = {
      _source: {
        name: 'John Wayne',
        state: 'New Jersey',
        'city.street': 'Jefferson Ave',
      },
      highlight: {
        state: ['<em>New</em> Jersey'],
        'state.exact': ['New <em>Jersey</em>'],
        'city.street': ['<em>Jefferson</em> Ave'],
        'city.street.exact': ['Jefferson <em>Ave</em>'],
      },
    }
    inlineHighlightResults(
      {
        pre: '<em>',
        post: '</em>',
      },
      {
        elasticsearch: {
          subFields: {
            exact: { shouldHighlight: true },
          },
        },
        fields: {
          state: {
            elasticsearch: {
              fields: { exact: {} },
            },
          },
          'city.street': {
            elasticsearch: {
              fields: { exact: {} },
            },
          },
        },
      },
      [hit]
    )
    const expected = {
      _source: {
        name: 'John Wayne',
        state: '<em>New</em> <em>Jersey</em>',
        'city.street': '<em>Jefferson</em> <em>Ave</em>',
      },
      highlight: {
        state: ['<em>New</em> Jersey'],
        'state.exact': ['New <em>Jersey</em>'],
        'city.street': ['<em>Jefferson</em> Ave'],
        'city.street.exact': ['Jefferson <em>Ave</em>'],
      },
    }
    expect(hit).toEqual(expected)
  })
})
