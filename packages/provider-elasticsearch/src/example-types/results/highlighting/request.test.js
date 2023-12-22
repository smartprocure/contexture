import { schema } from './testSchema.js'
import {
  addPathsToRequestSource,
  getAllHighlightFields,
  getHighlightFieldsGroupsPaths,
  getRequestHighlightFields,
} from './request.js'

describe('getHighlightFieldsGroupsPaths', () => {
  it('should return all combinations of fields groups and sub-fields', () => {
    let schema = {
      elasticsearch: {
        subFields: {
          keyword: { highlight: false },
          subfield1: { highlight: true },
          subfield2: { highlight: true },
        },
      },
      fields: {
        fieldsGroup1: {
          elasticsearch: {
            dataType: 'text',
            mapping: {
              fields: { keyword: {}, subfield1: {}, subfield2: {} },
            },
          },
        },
        fieldsGroup2: {
          elasticsearch: {
            dataType: 'text',
            mapping: {
              fields: { keyword: {}, subfield1: {}, subfield2: {} },
            },
          },
        },
        state: {
          elasticsearch: {
            dataType: 'text',
            mapping: {
              copy_to: ['fieldsGroup1', 'fieldsGroup2'],
            },
          },
        },
      },
    }
    expect(getHighlightFieldsGroupsPaths(schema)).toEqual([
      'fieldsGroup1',
      'fieldsGroup2',
      'fieldsGroup1.subfield1',
      'fieldsGroup2.subfield1',
      'fieldsGroup1.subfield2',
      'fieldsGroup2.subfield2',
    ])
  })
})

describe('getAllHighlightFields', () => {
  it('should include subfields that can be highlighted', () => {
    let schema = {
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
            mapping: { fields: { keyword: {}, subfield: {} } },
          },
        },
      },
    }
    let actual = getAllHighlightFields(schema)
    expect(actual).toEqual({
      state: {
        elasticsearch: {
          dataType: 'text',
          mapping: { fields: { keyword: {}, subfield: {} } },
        },
      },
      'state.subfield': {},
    })
  })

  it('should exclude groups fields', () => {
    let schema = {
      fields: {
        all: { elasticsearch: { dataType: 'text' } },
        address: { elasticsearch: { dataType: 'text' } },
        state: {
          elasticsearch: {
            dataType: 'text',
            mapping: { copy_to: ['all', 'address'] },
          },
        },
        'city.street': {
          elasticsearch: {
            dataType: 'text',
            mapping: { copy_to: ['all', 'address'] },
          },
        },
      },
    }
    let actual = getAllHighlightFields(schema)
    expect(actual).toEqual({
      state: {
        elasticsearch: {
          dataType: 'text',
          mapping: { copy_to: ['all', 'address'] },
        },
      },
      'city.street': {
        elasticsearch: {
          dataType: 'text',
          mapping: { copy_to: ['all', 'address'] },
        },
      },
    })
  })
})

describe('addPathsToRequestSource()', () => {
  describe('paths with no wildcards', () => {
    it('should not add path when source is empty', () => {
      let source = {}
      let result = addPathsToRequestSource(schema, source, ['library.name'])
      expect(result).toEqual(source)
    })

    it('should not add path when there are no paths to add', () => {
      let source = {
        includes: ['library.name'],
        excludes: ['library.about'],
      }
      let result = addPathsToRequestSource(schema, source)
      expect(result).toEqual({
        includes: ['library.name'],
        excludes: ['library.about'],
      })
    })

    it('should not add path when includes is empty and path is not excluded', () => {
      let source = {
        excludes: ['library.about'],
      }
      let result = addPathsToRequestSource(schema, source, ['library.name'])
      expect(result).toEqual({
        excludes: ['library.about'],
      })
    })

    it('should add path when includes is empty and path is excluded', () => {
      let source = {
        excludes: ['library.name'],
      }
      let result = addPathsToRequestSource(schema, source, ['library.name'])
      expect(result).toEqual({ addedPaths: ['library.name'] })
    })

    it('should add path when includes is not empty and path is not excluded', () => {
      let source = {
        includes: ['library.categories'],
        excludes: ['library.about'],
      }
      let result = addPathsToRequestSource(schema, source, ['library.name'])
      expect(result).toEqual({
        includes: ['library.name', 'library.categories'],
        excludes: ['library.about'],
        addedPaths: ['library.name'],
      })
    })

    it('should add path when includes is not empty and path is excluded', () => {
      let source = {
        includes: ['library.categories'],
        excludes: ['library.name'],
      }
      let result = addPathsToRequestSource(schema, source, ['library.name'])
      expect(result).toEqual({
        includes: ['library.name', 'library.categories'],
        addedPaths: ['library.name'],
      })
    })

    it('should add path in array of objects and adjust excludes accordingly', () => {
      let source = {
        includes: ['library.about'],
        excludes: ['library.books'],
      }
      let result = addPathsToRequestSource(schema, source, [
        'library.books.cover.title',
      ])
      expect(result).toEqual({
        includes: ['library.books.cover.title', 'library.about'],
        excludes: ['library.books.cover.author'],
        addedPaths: ['library.books.cover.title'],
      })
    })
  })

  describe('paths with wildcards', () => {
    it('should not add path when includes is empty and path is not excluded', () => {
      let source = {
        excludes: ['library.books.*'],
      }
      let result = addPathsToRequestSource(schema, source, ['library.name'])
      expect(result).toEqual({
        excludes: ['library.books.*'],
      })
    })

    it('should add path when includes is empty and path is excluded', () => {
      let source = {
        excludes: ['library.*'],
      }
      let result = addPathsToRequestSource(schema, source, ['library.about'])
      expect(result).toEqual({
        excludes: [
          'library.name',
          'library.categories',
          'library.books.cover.title',
          'library.books.cover.author',
        ],
        addedPaths: ['library.about'],
      })
    })

    it('should add path when includes is not empty and path is not excluded', () => {
      let source = {
        includes: ['library.about'],
        excludes: ['library.books.*'],
      }
      let result = addPathsToRequestSource(schema, source, ['library.name'])
      expect(result).toEqual({
        includes: ['library.name', 'library.about'],
        excludes: ['library.books.*'],
        addedPaths: ['library.name'],
      })
    })

    it('should add path when includes is not empty and path is excluded', () => {
      let source = {
        includes: ['library.*'],
        excludes: ['library.books.*'],
      }
      let result = addPathsToRequestSource(schema, source, [
        'library.books.cover.title',
      ])
      expect(result).toEqual({
        includes: ['library.*'],
        excludes: ['library.books.cover.author'],
        addedPaths: ['library.books.cover.title'],
      })
    })

    it('should expand includes when adding to it', () => {
      let source = {
        includes: ['library.books.*'],
        excludes: ['library.name'],
      }
      let result = addPathsToRequestSource(schema, source, ['library.name'])
      expect(result).toEqual({
        includes: [
          'library.name',
          'library.books.cover.title',
          'library.books.cover.author',
        ],
        addedPaths: ['library.name'],
      })
    })
  })
})

describe('getRequestHighlightFields()', () => {
  it('should exclude fields without mappings', () => {
    let schema = {
      fields: {
        other: {},
        state: { elasticsearch: { dataType: 'text' } },
        'city.street': { elasticsearch: { dataType: 'text' } },
      },
    }
    let node = {}
    let actual = getRequestHighlightFields(schema, node)
    expect(actual).toEqual({
      state: {},
      'city.street': {},
    })
  })

  it('should exclude group fields', () => {
    let schema = {
      fields: {
        all: { elasticsearch: { dataType: 'text' } },
        address: { elasticsearch: { dataType: 'text' } },
        state: {
          elasticsearch: {
            dataType: 'text',
            mapping: { copy_to: ['all', 'address'] },
          },
        },
        'city.street': {
          elasticsearch: {
            dataType: 'text',
            mapping: { copy_to: ['all', 'address'] },
          },
        },
      },
    }
    let node = {}
    let actual = getRequestHighlightFields(schema, node)
    expect(actual).toEqual({
      state: {},
      'city.street': {},
    })
  })

  it('should include whitelisted sub fields', () => {
    let schema = {
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
            mapping: { fields: { keyword: {}, subfield: {} } },
          },
        },
        'city.street': {
          elasticsearch: {
            dataType: 'text',
            mapping: { fields: { keyword: {}, subfield: {} } },
          },
        },
      },
    }
    let node = {}
    let actual = getRequestHighlightFields(schema, node)
    expect(actual).toEqual({
      state: {},
      'state.subfield': {},
      'city.street': {},
      'city.street.subfield': {},
    })
  })

  it('should generate configuration for blob text fields', () => {
    let schema = {
      elasticsearch: {
        subFields: {
          subfield: {
            highlight: true,
          },
        },
      },
      fields: {
        state: {
          subType: 'blob',
          elasticsearch: {
            dataType: 'text',
            mapping: {
              fields: {
                subfield: {
                  type: 'text',
                },
              },
            },
          },
        },
      },
    }
    let node = {}
    let actual = getRequestHighlightFields(schema, node)
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
    let schema = {
      fields: {
        address: {
          elasticsearch: {
            dataType: 'text',
          },
        },
        state: {
          elasticsearch: {
            dataType: 'text',
            mapping: { copy_to: ['address'] },
          },
        },
        'city.street': {
          elasticsearch: {
            dataType: 'text',
            mapping: { copy_to: ['address'] },
          },
        },
      },
    }
    let query = (field) => ({
      bool: {
        must: [
          { terms: { [field]: 'memphis' } },
          { query_string: { query: 'memphis', default_field: field } },
        ],
      },
    })
    let node = {
      _meta: {
        relevantFilters: query('address'),
      },
    }
    let actual = getRequestHighlightFields(schema, node)
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
    let schema = {
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
            mapping: {
              copy_to: ['address'],
              fields: {
                subfield: { type: 'text' },
              },
            },
          },
        },
        'city.street': {
          elasticsearch: {
            dataType: 'text',
            mapping: {
              copy_to: ['address'],
              fields: {
                subfield: { type: 'text' },
              },
            },
          },
        },
      },
    }
    let query = (field) => ({
      bool: {
        must: [
          { terms: { [field]: 'memphis' } },
          { query_string: { query: 'memphis', default_field: field } },
        ],
      },
    })
    let node = {
      _meta: {
        relevantFilters: query('address.subfield'),
      },
    }
    let actual = getRequestHighlightFields(schema, node)
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
