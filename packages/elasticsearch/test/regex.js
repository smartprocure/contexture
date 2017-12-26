let regex = require('../src/regex')
let {expect} = require('chai')

describe('regex', () => {
  describe('toSafeRegex', () => {
    it('case sensitive', () => {
      expect(regex.toSafeRegex(false)('Nuclear ord?')).to.eql(
        '[Nn][Uu][Cc][Ll][Ee][Aa][Rr] [Oo][Rr][Dd]\\?'
      )
    })
    it('case insensitive', () => {
      expect(regex.toSafeRegex(true)('Nuclear [?]')).to.eql('Nuclear \\[\\?\\]')
    })
  })
  describe('buildRegexQueryForWords', () => {
    it('should work', () => {
      expect(
        regex.buildRegexQueryForWords('_all', false)('Nuclear Ord')
      ).to.deep.eql({
        bool: {
          must: [
            {
              regexp: {
                _all: '.*[Nn][Uu][Cc][Ll][Ee][Aa][Rr].*',
              },
            },
            {
              regexp: {
                _all: '.*[Oo][Rr][Dd].*',
              },
            },
          ],
        },
      })
    })
  })
})
