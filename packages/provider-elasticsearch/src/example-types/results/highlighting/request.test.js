import { schema } from './schema.test.js'
import {
  addPathsToRequestSource,
  getRequestHighlightFields,
} from './request.js'

describe('addPathsToRequestSource()', () => {
  describe('paths with no wildcards', () => {
    it('should not add path when source is empty', () => {
      const source = {}
      const added = addPathsToRequestSource(schema, source, ['library.name'])
      expect(source).toEqual({})
      expect(added).toEqual([])
    })

    it('should not add path when there are no paths to add', () => {
      const source = {
        includes: ['library.name'],
        excludes: ['library.about'],
      }
      const added = addPathsToRequestSource(schema, source)
      expect(source).toEqual({
        includes: ['library.name'],
        excludes: ['library.about'],
      })
      expect(added).toEqual([])
    })

    it('should not add path when includes is empty and path is not excluded', () => {
      const source = {
        excludes: ['library.about'],
      }
      const added = addPathsToRequestSource(schema, source, ['library.name'])
      expect(source).toEqual({
        excludes: ['library.about'],
      })
      expect(added).toEqual([])
    })

    it('should add path when includes is empty and path is excluded', () => {
      const source = {
        excludes: ['library.name'],
      }
      const added = addPathsToRequestSource(schema, source, ['library.name'])
      expect(source).toEqual({})
      expect(added).toEqual(['library.name'])
    })

    it('should add path when includes is not empty and path is not excluded', () => {
      const source = {
        includes: ['library.categories'],
        excludes: ['library.about'],
      }
      const added = addPathsToRequestSource(schema, source, ['library.name'])
      expect(source).toEqual({
        includes: ['library.categories', 'library.name'],
        excludes: ['library.about'],
      })
      expect(added).toEqual(['library.name'])
    })

    it('should add path when includes is not empty and path is excluded', () => {
      const source = {
        includes: ['library.categories'],
        excludes: ['library.name'],
      }
      const added = addPathsToRequestSource(schema, source, ['library.name'])
      expect(source).toEqual({
        includes: ['library.categories', 'library.name'],
      })
      expect(added).toEqual(['library.name'])
    })

    it('should add path in array of objects and adjust excludes accordingly', () => {
      const source = {
        includes: ['library.about'],
        excludes: ['library.books'],
      }
      const added = addPathsToRequestSource(schema, source, [
        'library.books.cover.title',
      ])
      expect(source).toEqual({
        includes: ['library.about', 'library.books.cover.title'],
        excludes: ['library.books.cover.author'],
      })
      expect(added).toEqual(['library.books.cover.title'])
    })
  })

  describe('paths with wildcards', () => {
    it('should not add path when includes is empty and path is not excluded', () => {
      const source = {
        excludes: ['library.books.*'],
      }
      const added = addPathsToRequestSource(schema, source, ['library.name'])
      expect(source).toEqual({
        excludes: ['library.books.*'],
      })
      expect(added).toEqual([])
    })

    it('should add path when includes is empty and path is excluded', () => {
      const source = {
        excludes: ['library.*'],
      }
      const added = addPathsToRequestSource(schema, source, ['library.about'])
      expect(source).toEqual({
        excludes: [
          'library.name',
          'library.categories',
          'library.books.cover.title',
          'library.books.cover.author',
        ],
      })
      expect(added).toEqual(['library.about'])
    })

    it('should add path when includes is not empty and path is not excluded', () => {
      const source = {
        includes: ['library.about'],
        excludes: ['library.books.*'],
      }
      const added = addPathsToRequestSource(schema, source, ['library.name'])
      expect(source).toEqual({
        includes: ['library.about', 'library.name'],
        excludes: ['library.books.*'],
      })
      expect(added).toEqual(['library.name'])
    })

    it('should add path when includes is not empty and path is excluded', () => {
      const source = {
        includes: ['library.*'],
        excludes: ['library.books.*'],
      }
      const added = addPathsToRequestSource(schema, source, [
        'library.books.cover.title',
      ])
      expect(source).toEqual({
        includes: ['library.*'],
        excludes: ['library.books.cover.author'],
      })
      expect(added).toEqual(['library.books.cover.title'])
    })

    it('should expand includes when adding to it', () => {
      const source = {
        includes: ['library.books.*'],
        excludes: ['library.name'],
      }
      const added = addPathsToRequestSource(schema, source, ['library.name'])
      expect(source).toEqual({
        includes: [
          'library.books.cover.title',
          'library.books.cover.author',
          'library.name',
        ],
      })
      expect(added).toEqual(['library.name'])
    })
  })
})

describe('getRequestHighlightFields()', () => {
  it('should exclude fields without mappings', () => {
    const schema = {
      fields: {
        other: {},
        state: { elasticsearch: { dataType: 'text' } },
        'city.street': { elasticsearch: { dataType: 'text' } },
      },
    }
    const node = {}
    const actual = getRequestHighlightFields(schema, node)
    expect(actual).toEqual({
      state: {},
      'city.street': {},
    })
  })

  it('should exclude group fields', () => {
    const schema = {
      fields: {
        all: { elasticsearch: { dataType: 'text' } },
        address: { elasticsearch: { dataType: 'text' } },
        state: {
          elasticsearch: { dataType: 'text', copy_to: ['all', 'address'] },
        },
        'city.street': {
          elasticsearch: { dataType: 'text', copy_to: ['all', 'address'] },
        },
      },
    }
    const node = {}
    const actual = getRequestHighlightFields(schema, node)
    expect(actual).toEqual({
      state: {},
      'city.street': {},
    })
  })

  it('should include whitelisted sub fields', () => {
    const schema = {
      elasticsearch: {
        subFields: {
          keyword: { highlight: false },
          subfield: { highlight: true },
        },
      },
      fields: {
        state: {
          elasticsearch: {
            dataType: 'text',
            fields: { keyword: {}, subfield: {} },
          },
        },
        'city.street': {
          elasticsearch: {
            dataType: 'text',
            fields: { keyword: {}, subfield: {} },
          },
        },
      },
    }
    const node = {}
    const actual = getRequestHighlightFields(schema, node)
    expect(actual).toEqual({
      state: {},
      'state.subfield': {},
      'city.street': {},
      'city.street.subfield': {},
    })
  })

  it('should generate configuration for blob text fields', () => {
    const schema = {
      elasticsearch: {
        subFields: {
          subfield: {
            highlight: true,
          },
        },
      },
      fields: {
        state: {
          elasticsearch: {
            dataType: 'text',
            meta: { subType: 'blob' },
            fields: {
              subfield: {
                dataType: 'text',
              },
            },
          },
        },
      },
    }
    const node = {}
    const actual = getRequestHighlightFields(schema, node)
    expect(actual).toEqual({
      state: {
        fragment_size: 250,
        number_of_fragments: 3,
      },
      'state.subfield': {
        fragment_size: 250,
        number_of_fragments: 3,
      },
    })
  })

  it('should generate highlight_query with fields groups replaced', () => {
    const schema = {
      fields: {
        address: {
          elasticsearch: {
            dataType: 'text',
          },
        },
        state: {
          elasticsearch: {
            dataType: 'text',
            copy_to: ['address'],
          },
        },
        'city.street': {
          elasticsearch: {
            dataType: 'text',
            copy_to: ['address'],
          },
        },
      },
    }
    const query = (field) => ({
      bool: {
        must: [
          { terms: { [field]: 'memphis' } },
          { query_string: { query: 'memphis', default_field: field } },
        ],
      },
    })
    const node = {
      _meta: {
        relevantFilters: query('address'),
      },
    }
    const actual = getRequestHighlightFields(schema, node)
    expect(actual).toEqual({
      state: {
        highlight_query: query('state'),
      },
      'city.street': {
        highlight_query: query('city.street'),
      },
    })
  })

  it('should generate highlight_query with fields groups replaced for sub fields', () => {
    const schema = {
      elasticsearch: {
        subFields: {
          subfield: { highlight: true },
        },
      },
      fields: {
        address: {
          elasticsearch: {
            dataType: 'text',
          },
        },
        state: {
          elasticsearch: {
            dataType: 'text',
            copy_to: ['address'],
            fields: {
              subfield: { dataType: 'text' },
            },
          },
        },
        'city.street': {
          elasticsearch: {
            dataType: 'text',
            copy_to: ['address'],
            fields: {
              subfield: { dataType: 'text' },
            },
          },
        },
      },
    }
    const query = (field) => ({
      bool: {
        must: [
          { terms: { [field]: 'memphis' } },
          { query_string: { query: 'memphis', default_field: field } },
        ],
      },
    })
    const node = {
      _meta: {
        relevantFilters: query('address.subfield'),
      },
    }
    const actual = getRequestHighlightFields(schema, node)
    expect(actual).toEqual({
      state: {},
      'state.subfield': { highlight_query: query('state.subfield') },
      'city.street': {},
      'city.street.subfield': {
        highlight_query: query('city.street.subfield'),
      },
    })
  })
})
