let text = require('../../src/example-types/text')
let { expect } = require('chai')

describe('text', () => {
  it('should check for values', () => {
    expect(
      !!text.hasValue({
        type: 'text',
        field: 'test',
        data: {
          values: ['asdf'],
        },
      })
    ).to.be.true
    expect(
      !!text.hasValue({
        type: 'text',
        field: 'test',
        data: {
          values: [],
        },
      })
    ).to.be.false
  })
  describe('filter', () => {
    let anyText = values => operator =>
      text.filter({
        key: 'test',
        type: 'text',
        field: 'description',
        data: {
          join: 'any',
          operator,
          values,
        },
      })
    let laserjetPrinterText = anyText(['laserjet', 'printer'])
    it('contains', () => {
      expect(laserjetPrinterText('contains')).to.deep.equal({
        query_string: {
          default_field: 'description',
          default_operator: 'OR',
          query: '"laserjet" "printer"',
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
                  'description.untouched':
                    '.*[Ll][Aa][Ss][Ee][Rr][Jj][Ee][Tt].*',
                },
              },
              {
                regexp: {
                  'description.untouched': '.*[Pp][Rr][Ii][Nn][Tt][Ee][Rr].*',
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
              regexp: {
                'description.untouched': '[Ll][Aa][Ss][Ee][Rr][Jj][Ee][Tt].*',
              },
            },
            {
              regexp: {
                'description.untouched': '[Pp][Rr][Ii][Nn][Tt][Ee][Rr].*',
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
                'description.untouched': '.*[Ll][Aa][Ss][Ee][Rr][Jj][Ee][Tt]',
              },
            },
            {
              regexp: {
                'description.untouched': '.*[Pp][Rr][Ii][Nn][Tt][Ee][Rr]',
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
                'description.untouched': '[Ll][Aa][Ss][Ee][Rr][Jj][Ee][Tt]',
              },
            },
            {
              regexp: {
                'description.untouched': '[Pp][Rr][Ii][Nn][Tt][Ee][Rr]',
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
                    'description.untouched': '[Ll][Aa][Ss][Ee][Rr][Jj][Ee][Tt]',
                  },
                },
                {
                  regexp: {
                    'description.untouched': '[Pp][Rr][Ii][Nn][Tt][Ee][Rr]',
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
                    description: '.*[Ll][Aa][Ss][Ee][Rr][Jj][Ee][Tt].*',
                  },
                },
                {
                  regexp: {
                    description: '.*[Pp][Rr][Ii][Nn][Tt][Ee][Rr].*',
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
              regexp: {
                description: '[Ll][Aa][Ss][Ee][Rr][Jj][Ee][Tt].*',
              },
            },
            {
              regexp: {
                description: '[Pp][Rr][Ii][Nn][Tt][Ee][Rr].*',
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
                description: '.*[Ll][Aa][Ss][Ee][Rr][Jj][Ee][Tt]',
              },
            },
            {
              regexp: {
                description: '.*[Pp][Rr][Ii][Nn][Tt][Ee][Rr]',
              },
            },
          ],
        },
      })
      expect(() => anyText(['<', '2', 'words'])('wordEndsWith')).to.throw
    })
  })
})
