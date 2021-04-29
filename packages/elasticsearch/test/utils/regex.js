let regex = require('../../src/utils/regex')
let { expect } = require('chai')

describe('regex', () => {
  it('toSafeRegex', () => {
    expect(regex.toSafeRegex('Nuclear ord?')).to.eql('Nuclear ord')
  })
  it('buildRegexQueryForWords', () => {
    expect(regex.buildRegexQueryForWords('_all')('Nuclear Ord')).to.deep.eql({
      bool: {
        must: [
          { regexp: { _all: '.*(Nuclear).*', case_insensitive: true } },
          { regexp: { _all: '.*(Ord).*', case_insensitive: true } },
        ],
      },
    })
  })
})
