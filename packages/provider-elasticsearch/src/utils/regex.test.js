import * as regex from './regex.js'
import { expect, describe, it } from 'vitest'

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
