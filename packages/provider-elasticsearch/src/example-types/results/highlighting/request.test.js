import { getRequestBodyHighlight } from './request.js'

describe('getRequestBodyHighlight()', () => {
  it('should exclude fields without mappings', () => {
    const schema = {
      fields: {
        other: {},
        state: { elasticsearch: {} },
        'city.street': { elasticsearch: {} },
      },
    }
    const actual = getRequestBodyHighlight(schema, {}, {}).fields
    const expected = {
      state: {},
      'city.street': {},
    }
    expect(actual).toEqual(expected)
  })

  it('should exclude group fields', () => {
    const schema = {
      fields: {
        all: { elasticsearch: {} },
        address: { elasticsearch: {} },
        state: { elasticsearch: { copy_to: ['all', 'address'] } },
        'city.street': { elasticsearch: { copy_to: ['all', 'address'] } },
      },
    }
    const actual = getRequestBodyHighlight(schema, {}, {}).fields
    const expected = {
      state: {},
      'city.street': {},
    }
    expect(actual).toEqual(expected)
  })

  it('should include whitelisted sub fields', () => {
    const schema = {
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
    }
    const actual = getRequestBodyHighlight(schema, {}, {}).fields
    const expected = {
      state: {},
      'state.exact': {},
      'city.street': {},
      'city.street.exact': {},
    }
    expect(actual).toEqual(expected)
  })

  it('should generate configuration for blob text fields', () => {
    const schema = {
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
    }
    const actual = getRequestBodyHighlight(schema, {}, {}).fields
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

  it('should generate highlight_query with fields groups replaced', () => {
    const schema = {
      fields: {
        address: { elasticsearch: {} },
        state: { elasticsearch: { copy_to: ['address'] } },
        'city.street': { elasticsearch: { copy_to: ['address'] } },
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
    const node = { _meta: { relevantFilters: query('address') } }
    const actual = getRequestBodyHighlight(schema, node, {}).fields
    const expected = {
      state: {
        highlight_query: query('state'),
      },
      'city.street': {
        highlight_query: query('city.street'),
      },
    }
    expect(actual).toEqual(expected)
  })

  it('should generate highlight_query with fields groups replaced for sub fields', () => {
    const schema = {
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
    }
    const query = (field) => ({
      bool: {
        must: [
          { terms: { [field]: 'memphis' } },
          { query_string: { query: 'memphis', default_field: field } },
        ],
      },
    })
    const node = { _meta: { relevantFilters: query('address.exact') } }
    const actual = getRequestBodyHighlight(schema, node, {}).fields
    const expected = {
      state: {},
      'state.exact': { highlight_query: query('state.exact') },
      'city.street': {},
      'city.street.exact': { highlight_query: query('city.street.exact') },
    }
    expect(actual).toEqual(expected)
  })
})
