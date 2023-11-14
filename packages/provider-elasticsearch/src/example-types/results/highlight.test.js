import {
  getHighlightFields,
  mergeHighlights,
  alignHighlightsWithSourceStructure,
  highlightArray,
} from './highlight.js'

const highlightConfig = { pre_tag: '<em>', post_tag: '</em>' }

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
            keyword: { highlight: false },
            exact: { highlight: true },
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
            exact: { highlight: true },
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
            exact: { highlight: true },
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
  it('should merge highlights that do not overlap', () => {
    const actual = mergeHighlights(
      highlightConfig.pre_tag,
      highlightConfig.post_tag,
      'The <em>quick</em> brown fox jumps over the lazy dog',
      'The quick brown <em>fox jumps</em> over the lazy dog'
    )
    const expected =
      'The <em>quick</em> brown <em>fox jumps</em> over the lazy dog'
    expect(actual).toEqual(expected)
  })

  it('should merge highlights that overlap', () => {
    const actual = mergeHighlights(
      highlightConfig.pre_tag,
      highlightConfig.post_tag,
      'The quick brown fox <em>jumps over</em> the lazy dog',
      'The quick brown <em>fox jumps</em> over the lazy dog'
    )
    const expected = 'The quick brown <em>fox jumps over</em> the lazy dog'
    expect(actual).toEqual(expected)
  })

  it('should merge highlights that are contained within another', () => {
    const actual = mergeHighlights(
      highlightConfig.pre_tag,
      highlightConfig.post_tag,
      'The quick brown fox <em>jumps</em> over the lazy dog',
      'The quick brown <em>fox jumps over</em> the lazy dog'
    )
    const expected = 'The quick brown <em>fox jumps over</em> the lazy dog'
    expect(actual).toEqual(expected)
  })

  it('should merge highlights at the end of the string', () => {
    const actual = mergeHighlights(
      highlightConfig.pre_tag,
      highlightConfig.post_tag,
      'The quick brown fox <em>jumps</em> over the lazy dog',
      'The quick brown fox jumps over the lazy <em>dog</em>'
    )
    const expected =
      'The quick brown fox <em>jumps</em> over the lazy <em>dog</em>'
    expect(actual).toEqual(expected)
  })
})

describe('highlightArray()', () => {
  it('should return ordered array of fragments', () => {
    const actual = highlightArray(
      ['Meridian St.', 'Collins Ave.'],
      ['Collins <em>Ave.</em>', '<em>Meridian St.</em>'],
      highlightConfig
    )
    const expected = ['<em>Meridian St.</em>', 'Collins <em>Ave.</em>']
    expect(actual).toEqual(expected)
  })

  it('should return ordered and filtered array of fragments', () => {
    const actual = highlightArray(
      ['Meridian St.', 'Collins Ave.', 'Raunch Rd.'],
      ['Collins <em>Ave.</em>', '<em>Meridian St.</em>'],
      { ...highlightConfig, filterSourceArrays: true }
    )
    const expected = ['<em>Meridian St.</em>', 'Collins <em>Ave.</em>']
    expect(actual).toEqual(expected)
  })

  it('should return ordered array of objects with fragments', () => {
    const actual = highlightArray(
      [
        { state: 'Florida', city: { number: 405, street: 'Meridian St.' } },
        { state: 'Georgia', city: { number: 235, street: 'Collins Ave.' } },
      ],
      ['Collins <em>Ave.</em>', '<em>Meridian St.</em>'],
      { ...highlightConfig, fragmentPath: 'city.street' }
    )
    const expected = [
      {
        state: 'Florida',
        city: { number: 405, street: '<em>Meridian St.</em>' },
      },
      {
        state: 'Georgia',
        city: { number: 235, street: 'Collins <em>Ave.</em>' },
      },
    ]
    expect(actual).toEqual(expected)
  })

  it('should return ordered and filtered array of objects with fragments', () => {
    const actual = highlightArray(
      [
        { state: 'Florida', city: { number: 405, street: 'Meridian St.' } },
        { state: 'Georgia', city: { number: 235, street: 'Collins Ave.' } },
        { state: 'Iowa', city: { number: 111, street: 'Raunch Rd.' } },
      ],
      ['Collins <em>Ave.</em>', '<em>Meridian St.</em>'],
      {
        ...highlightConfig,
        fragmentPath: 'city.street',
        filterSourceArrays: true,
      }
    )
    const expected = [
      {
        state: 'Florida',
        city: { number: 405, street: '<em>Meridian St.</em>' },
      },
      {
        state: 'Georgia',
        city: { number: 235, street: 'Collins <em>Ave.</em>' },
      },
    ]
    expect(actual).toEqual(expected)
  })
})

describe('alignHighlightsWithSourceStructure()', () => {
  describe('text fields', () => {
    const schema = {
      elasticsearch: {
        subFields: {
          exact: { highlight: true },
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
    }

    it('should merge fragments', () => {
      const hit = {
        _source: {
          name: 'John Wayne',
          state: 'New Jersey',
          city: { street: 'Jefferson Ave' },
        },
        highlight: {
          state: ['<em>New</em> Jersey'],
          'state.exact': ['New <em>Jersey</em>'],
          'city.street': ['<em>Jefferson</em> Ave'],
          'city.street.exact': ['Jefferson <em>Ave</em>'],
        },
      }
      const actual = alignHighlightsWithSourceStructure(
        schema,
        highlightConfig
      )(hit)
      const expected = {
        state: '<em>New</em> <em>Jersey</em>',
        'city.street': '<em>Jefferson</em> <em>Ave</em>',
      }
      expect(actual).toEqual(expected)
    })
  })

  describe('blob text fields', () => {
    const schema = {
      elasticsearch: {
        subFields: {
          exact: { highlight: true },
        },
      },
      fields: {
        blob: {
          elasticsearch: {
            meta: { subType: 'blob' },
            fields: { exact: {} },
          },
        },
      },
    }

    it('should not merge fragments', () => {
      const hit = {
        _source: {},
        highlight: {
          blob: [
            '<em>Meridian</em> St.',
            '<em>Collins</em> Ave.',
            '<em>Ocean</em> Drive',
          ],
          'blob.exact': [
            '<em>Jefferson</em> Ave.',
            '<em>Washington</em> St.',
            '<em>Lincoln</em> Rd.',
          ],
        },
      }
      const actual = alignHighlightsWithSourceStructure(
        schema,
        highlightConfig
      )(hit)
      const expected = {
        blob: [
          '<em>Meridian</em> St.',
          '<em>Collins</em> Ave.',
          '<em>Ocean</em> Drive',
          '<em>Jefferson</em> Ave.',
          '<em>Washington</em> St.',
          '<em>Lincoln</em> Rd.',
        ],
      }
      expect(actual).toEqual(expected)
    })
  })

  describe('arrays of strings', () => {
    const schema = {
      fields: {
        state: {},
        'city.street': { elasticsearch: { meta: { subType: 'array' } } },
      },
    }

    it('should inline array of strings when source is empty', () => {
      const hit = {
        _source: {},
        highlight: {
          'city.street': ['Collins <em>Ave.</em>', '<em>Meridian St.</em>'],
        },
      }
      const actual = alignHighlightsWithSourceStructure(
        schema,
        highlightConfig
      )(hit)
      const expected = {
        'city.street': ['Collins <em>Ave.</em>', '<em>Meridian St.</em>'],
      }
      expect(actual).toEqual(expected)
    })

    it('should inline array of strings when source has value', () => {
      const hit = {
        _source: {
          city: {
            street: ['Jefferson Ave.', 'Meridian St.', 'Collins Ave.'],
          },
        },
        highlight: {
          'city.street': ['Collins <em>Ave.</em>', '<em>Meridian St.</em>'],
        },
      }
      const actual = alignHighlightsWithSourceStructure(
        schema,
        highlightConfig
      )(hit)
      const expected = {
        'city.street': [
          'Jefferson Ave.',
          '<em>Meridian St.</em>',
          'Collins <em>Ave.</em>',
        ],
      }
      expect(actual).toEqual(expected)
    })

    it('should inline and filter array of strings when source is empty', () => {
      const hit = {
        _source: {},
        highlight: {
          'city.street': ['Collins <em>Ave.</em>', '<em>Meridian St.</em>'],
        },
      }
      const actual = alignHighlightsWithSourceStructure(schema, {
        ...highlightConfig,
        filterSourceArrays: true,
      })(hit)
      const expected = {
        'city.street': ['Collins <em>Ave.</em>', '<em>Meridian St.</em>'],
      }
      expect(actual).toEqual(expected)
    })

    it('should inline and filter array of strings when source has value', () => {
      const hit = {
        _source: {
          city: {
            street: [
              'Jefferson Ave.',
              'Washington St.',
              'Meridian St.',
              'Collins Ave.',
              'Ocean Drive',
            ],
          },
        },
        highlight: {
          'city.street': ['Collins <em>Ave.</em>', '<em>Meridian St.</em>'],
        },
      }
      const actual = alignHighlightsWithSourceStructure(schema, {
        ...highlightConfig,
        filterSourceArrays: true,
      })(hit)
      const expected = {
        'city.street': ['<em>Meridian St.</em>', 'Collins <em>Ave.</em>'],
      }
      expect(actual).toEqual(expected)
    })

    it('should inline source array with empty array when there are no highlights', () => {
      const hit = {
        _source: {
          state: 'New Jersey',
          city: {
            street: [
              'Jefferson Ave.',
              'Washington St.',
              'Meridian St.',
              'Collins Ave.',
              'Ocean Drive',
            ],
          },
        },
        highlight: {
          state: '<em>New</em> Jersey',
        },
      }
      const actual = alignHighlightsWithSourceStructure(schema, {
        ...highlightConfig,
        filterSourceArrays: true,
      })(hit)
      const expected = {
        state: '<em>New</em> Jersey',
        'city.street': [],
      }
      expect(actual).toEqual(expected)
    })
  })

  describe('arrays of objects', () => {
    const schema = {
      fields: {
        'city.street': { elasticsearch: { meta: { subType: 'array' } } },
        'city.street.name': {},
      },
    }

    it('should inline array of objects when source is empty', () => {
      const hit = {
        _source: {},
        highlight: {
          'city.street.name': [
            'Collins <em>Ave.</em>',
            '<em>Meridian St.</em>',
          ],
        },
      }
      const actual = alignHighlightsWithSourceStructure(
        schema,
        highlightConfig
      )(hit)
      const expected = {
        'city.street': [
          { name: 'Collins <em>Ave.</em>' },
          { name: '<em>Meridian St.</em>' },
        ],
      }
      expect(actual).toEqual(expected)
    })

    it('should inline array of objects when source has value', () => {
      const hit = {
        _source: {
          city: {
            street: [
              { number: 101, name: 'Jefferson Ave.' },
              { number: 235, name: 'Meridian St.' },
              { number: 9, name: 'Collins Ave.' },
            ],
          },
        },
        highlight: {
          'city.street.name': [
            'Collins <em>Ave.</em>',
            '<em>Meridian St.</em>',
          ],
        },
      }
      const actual = alignHighlightsWithSourceStructure(
        schema,
        highlightConfig
      )(hit)
      const expected = {
        'city.street': [
          { number: 101, name: 'Jefferson Ave.' },
          { number: 235, name: '<em>Meridian St.</em>' },
          { number: 9, name: 'Collins <em>Ave.</em>' },
        ],
      }
      expect(actual).toEqual(expected)
    })

    it('should inline and filter array of objects when source is empty', () => {
      const hit = {
        _source: {},
        highlight: {
          'city.street.name': [
            'Collins <em>Ave.</em>',
            '<em>Meridian St.</em>',
          ],
        },
      }
      const actual = alignHighlightsWithSourceStructure(schema, {
        ...highlightConfig,
        filterSourceArrays: true,
      })(hit)
      const expected = {
        'city.street': [
          { name: 'Collins <em>Ave.</em>' },
          { name: '<em>Meridian St.</em>' },
        ],
      }
      expect(actual).toEqual(expected)
    })

    it('should inline and filter array of objects when source has value', () => {
      const hit = {
        _source: {
          city: {
            street: [
              { number: 101, name: 'Jefferson Ave.' },
              { number: 789, name: 'Washington St.' },
              { number: 235, name: 'Meridian St.' },
              { number: 9, name: 'Collins Ave.' },
              { number: 655, name: 'Ocean Drive' },
            ],
          },
        },
        highlight: {
          'city.street.name': [
            'Collins <em>Ave.</em>',
            '<em>Meridian St.</em>',
          ],
        },
      }
      const actual = alignHighlightsWithSourceStructure(schema, {
        ...highlightConfig,
        filterSourceArrays: true,
      })(hit)
      const expected = {
        'city.street': [
          { number: 235, name: '<em>Meridian St.</em>' },
          { number: 9, name: 'Collins <em>Ave.</em>' },
        ],
      }
      expect(actual).toEqual(expected)
    })

    it('should inline source array with empty array when there are no highlights', () => {
      const hit = {
        _source: {
          state: 'New Jersey',
          city: {
            street: [
              { number: 101, name: 'Jefferson Ave.' },
              { number: 789, name: 'Washington St.' },
              { number: 235, name: 'Meridian St.' },
              { number: 9, name: 'Collins Ave.' },
              { number: 655, name: 'Ocean Drive' },
            ],
          },
        },
        highlight: {
          state: '<em>New</em> Jersey',
        },
      }
      const actual = alignHighlightsWithSourceStructure(schema, {
        ...highlightConfig,
        filterSourceArrays: true,
      })(hit)
      const expected = {
        state: '<em>New</em> Jersey',
        'city.street': [],
      }
      expect(actual).toEqual(expected)
    })
  })
})
