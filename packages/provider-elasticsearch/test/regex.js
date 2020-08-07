let regex = require('../src/regex')
let { expect } = require('chai')

describe('regex', () => {
  it('toSafeRegex', () => {
    expect(regex.toSafeRegex('Nuclear ord?')).to.eql(
      '[Nn][Uu][Cc][Ll][Ee][Aa][Rr] [Oo][Rr][Dd]\\?'
    )
  })
  it('buildRegexQueryForWords', () => {
    expect(regex.buildRegexQueryForWords('_all')('Nuclear Ord')).to.deep.eql({
      bool: {
        must: [
          { regexp: { _all: '.*([Nn][Uu][Cc][Ll][Ee][Aa][Rr]).*' } },
          { regexp: { _all: '.*([Oo][Rr][Dd]).*' } },
        ],
      },
    })
  })
})
