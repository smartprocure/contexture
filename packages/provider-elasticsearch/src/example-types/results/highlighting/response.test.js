import { transformHighlightResponse } from './response.js'

const config = { pre_tag: '<em>', post_tag: '</em>' }

describe('transformHighlightResponse()', () => {
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
      const actual = transformHighlightResponse(schema, config, hit)
      const expected = {
        state: '<em>New</em> <em>Jersey</em>',
        city: { street: '<em>Jefferson</em> <em>Ave</em>' },
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
      const actual = transformHighlightResponse(schema, config, hit)
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

    it('should do nothing when source is empty', () => {
      const hit = {
        _source: {},
        highlight: {
          'city.street': ['Collins <em>Ave.</em>', '<em>Meridian St.</em>'],
        },
      }
      const actual = transformHighlightResponse(schema, config, hit)
      const expected = {
        city: { street: ['Collins <em>Ave.</em>', '<em>Meridian St.</em>'] },
      }
      expect(actual).toEqual(expected)
    })

    it('should order items when source has value', () => {
      const hit = {
        _source: {
          city: {
            street: [
              'Jefferson Ave.',
              'Meridian St.',
              'Washington St.',
              'Collins Ave.',
            ],
          },
        },
        highlight: {
          'city.street': ['Collins <em>Ave.</em>', '<em>Meridian St.</em>'],
        },
      }
      const actual = transformHighlightResponse(schema, config, hit)
      const expected = {
        city: {
          street: [
            undefined,
            '<em>Meridian St.</em>',
            undefined,
            'Collins <em>Ave.</em>',
          ],
        },
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

    it('should do nothing when source is empty', () => {
      const hit = {
        _source: {},
        highlight: {
          'city.street.name': [
            'Collins <em>Ave.</em>',
            '<em>Meridian St.</em>',
          ],
        },
      }
      const actual = transformHighlightResponse(schema, config, hit)
      const expected = {
        city: {
          street: [
            { name: 'Collins <em>Ave.</em>' },
            { name: '<em>Meridian St.</em>' },
          ],
        },
      }
      expect(actual).toEqual(expected)
    })

    it('should order items when source has value', () => {
      const hit = {
        _source: {
          city: {
            street: [
              { number: 101, name: 'Jefferson Ave.' },
              { number: 235, name: 'Meridian St.' },
              { number: 88, name: 'Washington St.' },
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
      const actual = transformHighlightResponse(schema, config, hit)
      const expected = {
        city: {
          street: [
            undefined,
            { name: '<em>Meridian St.</em>' },
            undefined,
            { name: 'Collins <em>Ave.</em>' },
          ],
        },
      }
      expect(actual).toEqual(expected)
    })
  })
})
