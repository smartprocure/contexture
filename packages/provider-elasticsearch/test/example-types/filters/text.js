let text = require('../../../src/example-types/filters/text')
let { testSchema } = require('../testUtils')
let { expect } = require('chai')

describe('text', () => {
  it('should check for values', () => {
    expect(
      !!text.hasValue({
        type: 'text',
        field: 'test',
        values: ['asdf'],
      })
    ).to.be.true
    expect(
      !!text.hasValue({
        type: 'text',
        field: 'test',
        values: [],
      })
    ).to.be.false
  })
  describe('filter', () => {
    let anyText = values => (
      operator,
      schema = testSchema('description'),
      join = 'any'
    ) =>
      text.filter(
        {
          key: 'test',
          type: 'text',
          field: 'description',
          join,
          operator,
          values,
        },
        schema
      )
    let laserjetPrinterText = anyText(['laserjet', 'printer'])
    it('contains (match ALL)', () => {
      expect(
        laserjetPrinterText('contains', testSchema('description'), 'all')
      ).to.deep.equal({
        query_string: {
          default_field: 'description',
          default_operator: 'AND',
          query: '"laserjet" "printer"',
        },
      })
    })
    it('contains (match ANY)', () => {
      expect(laserjetPrinterText('contains')).to.deep.equal({
        query_string: {
          default_field: 'description',
          default_operator: 'OR',
          query: '"laserjet" "printer"',
        },
      })
    })
    it('contains (match NONE)', () => {
      expect(
        laserjetPrinterText('contains', testSchema('description'), 'none')
      ).to.deep.equal({
        bool: {
          must_not: {
            query_string: {
              default_field: 'description',
              default_operator: 'OR',
              query: '"laserjet" "printer"',
            },
          },
        },
      })
    })
    describe('containsWord', () => {
      it('should use regexp for < 3 words', () => {
        expect(laserjetPrinterText('containsWord')).to.deep.equal({
          bool: {
            should: [
              {
                regexp: {
                  'description.untouched': {
                    case_insensitive: true,
                    value: '.*laserjet.*',
                  },
                },
              },
              {
                regexp: {
                  'description.untouched': {
                    case_insensitive: true,
                    value: '.*printer.*',
                  },
                },
              },
            ],
          },
        })
      })
      it('should use query_string for > 2 words', () => {
        expect(anyText(['has', 'more', 'words'])('containsWord')).to.deep.equal(
          {
            query_string: {
              default_field: 'description',
              default_operator: 'OR',
              query: '"has" "more" "words"',
            },
          }
        )
      })
    })
    // it.skip('containsExact');
    it('startsWith', () => {
      expect(laserjetPrinterText('startsWith')).to.deep.equal({
        bool: {
          should: [
            {
              prefix: {
                'description.untouched': {
                  value: 'laserjet',
                  case_insensitive: true,
                },
              },
            },
            {
              prefix: {
                'description.untouched': {
                  value: 'printer',
                  case_insensitive: true,
                },
              },
            },
          ],
        },
      })
    })
    it('startsWith using alternative notAnalyzedField', () => {
      expect(
        laserjetPrinterText('startsWith', testSchema('description', 'keyword'))
      ).to.deep.equal({
        bool: {
          should: [
            {
              prefix: {
                'description.keyword': {
                  value: 'laserjet',
                  case_insensitive: true,
                },
              },
            },
            {
              prefix: {
                'description.keyword': {
                  value: 'printer',
                  case_insensitive: true,
                },
              },
            },
          ],
        },
      })
    })
    it('endsWith', () => {
      expect(laserjetPrinterText('endsWith')).to.deep.equal({
        bool: {
          should: [
            {
              regexp: {
                'description.untouched': {
                  case_insensitive: true,
                  value: '.*laserjet',
                },
              },
            },
            {
              regexp: {
                'description.untouched': {
                  case_insensitive: true,
                  value: '.*printer',
                },
              },
            },
          ],
        },
      })
      expect(() => anyText(['<', '2', 'words'])('endsWith')).to.throw
    })
    it('is', () => {
      expect(laserjetPrinterText('is')).to.deep.equal({
        bool: {
          should: [
            {
              regexp: {
                'description.untouched': {
                  case_insensitive: true,
                  value: 'laserjet',
                },
              },
            },
            {
              regexp: {
                'description.untouched': {
                  case_insensitive: true,
                  value: 'printer',
                },
              },
            },
          ],
        },
      })
    })
    it('isNot', () => {
      expect(laserjetPrinterText('isNot')).to.deep.equal({
        bool: {
          must_not: {
            bool: {
              should: [
                {
                  regexp: {
                    'description.untouched': {
                      case_insensitive: true,
                      value: 'laserjet',
                    },
                  },
                },
                {
                  regexp: {
                    'description.untouched': {
                      case_insensitive: true,
                      value: 'printer',
                    },
                  },
                },
              ],
            },
          },
        },
      })
    })
    it('doesNotContain', () => {
      expect(laserjetPrinterText('doesNotContain')).to.deep.equal({
        bool: {
          must_not: {
            bool: {
              should: [
                {
                  regexp: {
                    description: {
                      case_insensitive: true,
                      value: '.*laserjet.*',
                    },
                  },
                },
                {
                  regexp: {
                    description: {
                      case_insensitive: true,
                      value: '.*printer.*',
                    },
                  },
                },
              ],
            },
          },
        },
      })
    })
    it('wordStartsWith', () => {
      expect(laserjetPrinterText('wordStartsWith')).to.deep.equal({
        bool: {
          should: [
            {
              prefix: {
                description: {
                  value: 'laserjet',
                  case_insensitive: true,
                },
              },
            },
            {
              prefix: {
                description: {
                  value: 'printer',
                  case_insensitive: true,
                },
              },
            },
          ],
        },
      })
    })
    it('wordEndsWith', () => {
      expect(laserjetPrinterText('wordEndsWith')).to.deep.equal({
        bool: {
          should: [
            {
              regexp: {
                description: {
                  case_insensitive: true,
                  value: '.*laserjet',
                },
              },
            },
            {
              regexp: {
                description: {
                  case_insensitive: true,
                  value: '.*printer',
                },
              },
            },
          ],
        },
      })
      expect(() => anyText(['<', '2', 'words'])('wordEndsWith')).to.throw
    })
  })
})
