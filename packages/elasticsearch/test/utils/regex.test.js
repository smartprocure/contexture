import * as regex from '../../src/utils/regex.js'

describe('regex', () => {
  it('toSafeRegex', () => {
    expect(regex.toSafeRegex('Nuclear ord?')).toEqual('Nuclear ord')
  })
  it('buildRegexQueryForWords', () => {
    expect(regex.buildRegexQueryForWords('_all')('Nuclear Ord')).toEqual({
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
