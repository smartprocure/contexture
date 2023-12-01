import { getHighlightFields } from './request.js'

describe('getHighlightFields()', () => {
  it('should exclude fields without mappings', () => {
    const schema = {
      fields: {
        other: {},
        state: { elasticsearch: { dataType: 'text' } },
        'city.street': { elasticsearch: { dataType: 'text' } },
      },
    }
    const node = {}
    const actual = getHighlightFields(schema, node)
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
    const actual = getHighlightFields(schema, node)
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
    const actual = getHighlightFields(schema, node)
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
    const actual = getHighlightFields(schema, node)
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
    const actual = getHighlightFields(schema, node)
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
    const actual = getHighlightFields(schema, node)
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
