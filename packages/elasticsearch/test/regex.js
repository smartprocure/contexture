let regex = require('../src/regex')
let { expect } = require('chai')

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
  it('regexAnd', () => {
    expect(regex.regexAnd(['Nuclear', 'Ord'])).to.eql(
      '(Nuclear.*Ord)|(Ord.*Nuclear)'
    )
    expect(
      regex.regexAnd(['[Nn][Uu][Cc][Ll][Ee][Aa][Rr]', '[Oo][Rr]', '[Aa]'])
    ).to.eql(
      '([Nn][Uu][Cc][Ll][Ee][Aa][Rr].*[Oo][Rr].*[Aa])|([Nn][Uu][Cc][Ll][Ee][Aa][Rr].*[Aa].*[Oo][Rr])|([Oo][Rr].*[Nn][Uu][Cc][Ll][Ee][Aa][Rr].*[Aa])|([Oo][Rr].*[Aa].*[Nn][Uu][Cc][Ll][Ee][Aa][Rr])|([Aa].*[Nn][Uu][Cc][Ll][Ee][Aa][Rr].*[Oo][Rr])|([Aa].*[Oo][Rr].*[Nn][Uu][Cc][Ll][Ee][Aa][Rr])'
    )
  })
  describe('buildRegexForWords', () => {
    it('case sensitive in any order', () => {
      expect(regex.buildRegexForWords(true, true)('Nuclear Ord')).to.eql(
        '.*(Nuclear.*Ord)|(Ord.*Nuclear).*'
      )
    })
    it('case sensitive in specific order', () => {
      expect(regex.buildRegexForWords(true, false)('Nuclear Ord')).to.eql(
        '.*Nuclear.*Ord.*'
      )
    })
    it('case insensitive in any order', () => {
      expect(regex.buildRegexForWords(false, true)('Nuclear Ord')).to.eql(
        '.*([Nn][Uu][Cc][Ll][Ee][Aa][Rr].*[Oo][Rr][Dd])|([Oo][Rr][Dd].*[Nn][Uu][Cc][Ll][Ee][Aa][Rr]).*'
      )
    })
    it('case insensitive in specific order', () => {
      expect(regex.buildRegexForWords(false, false)('Nuclear Ord')).to.eql(
        '.*[Nn][Uu][Cc][Ll][Ee][Aa][Rr].*[Oo][Rr][Dd].*'
      )
    })
  })
})
