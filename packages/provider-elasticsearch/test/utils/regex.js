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
          {
            regexp: {
              _all: { value: '.*(Nuclear).*', case_insensitive: true },
            },
          },
          { regexp: { _all: { value: '.*(Ord).*', case_insensitive: true } } },
        ],
      },
    })
  })
})
