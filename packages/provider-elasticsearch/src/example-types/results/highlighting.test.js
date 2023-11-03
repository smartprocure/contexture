import _ from 'lodash/fp.js'
import { getHighlightFields } from './highlighting.js'

describe('getHighlightFields()', () => {
  it('should exclude fields without mappings', () => {
    const actual = getHighlightFields(
      {},
      {
        fields: {
          other: {},
          state: { elasticsearch: {} },
          'city.street': { elasticsearch: {} },
        },
      }
    )
    const expected = {
      state: {},
      'city.street': {},
    }
    expect(actual).toEqual(expected)
  })

  it('should exclude group fields', () => {
    const actual = getHighlightFields(
      {},
      {
        fields: {
          all: { elasticsearch: {} },
          address: { elasticsearch: {} },
          state: { elasticsearch: { copy_to: ['all', 'address'] } },
          'city.street': { elasticsearch: { copy_to: ['all', 'address'] } },
        },
      }
    )
    const expected = {
      state: {},
      'city.street': {},
    }
    expect(actual).toEqual(expected)
  })

  it('should include whitelisted sub fields', () => {
    const actual = getHighlightFields(
      {},
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
      }
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
      {},
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
      }
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
    const actual = getHighlightFields(queryWith('address'), {
      fields: {
        address: { elasticsearch: {} },
        state: { elasticsearch: { copy_to: ['address'] } },
        'city.street': { elasticsearch: { copy_to: ['address'] } },
      },
    })
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
    const actual = getHighlightFields(queryWith('address.exact'), {
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
    })
    const expected = {
      state: {},
      'state.exact': { highlight_query: queryWith('state.exact') },
      'city.street': {},
      'city.street.exact': { highlight_query: queryWith('city.street.exact') },
    }
    expect(actual).toEqual(expected)
  })
})
