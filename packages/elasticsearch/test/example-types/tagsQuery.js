let {
  wordPermutations,
  limitResultsToCertainTags,
  quoteAndTilde,
  escapeReservedChars,
  joinTags,
  tagToQueryString,
  tagsToQueryString,
  hasValue,
  filter,
} = require('../../src/example-types/tagsQuery')

let { expect } = require('chai')

describe('wordPermutations', () => {
  it('should handle empty string', () => {
    expect(wordPermutations('')).to.deep.equal([''])
  })
  it('should handle one word', () => {
    expect(wordPermutations('foo')).to.deep.equal(['foo'])
  })
  it('should handle two words', () => {
    expect(wordPermutations('foo bar')).to.deep.equal(['foo bar', 'bar foo'])
  })
})

describe('limitResultsToCertainTags', () => {
  it('should return truthy if found', () => {
    expect(limitResultsToCertainTags([{ onlyShowTheseResults: true }, {}])).to
      .exist
  })
})

describe('quoteAndTilde', () => {
  it('should quote if is phrase', () => {
    expect(quoteAndTilde({ isPhrase: true }, 'foo bar')).to.deep.equal(
      `"foo bar"`
    )
  })
  it('should quote and set distance', () => {
    expect(
      quoteAndTilde({ isPhrase: true, distance: 1 }, 'foo bar')
    ).to.deep.equal(`"foo bar"~1`)
  })
  it('should add tilde for misspellings', () => {
    expect(quoteAndTilde({ misspellings: 1 }, 'foo')).to.deep.equal(`foo~`)
  })
})

describe('escapeReservedChars', () => {
  it('should escape reserved characters', () => {
    expect(escapeReservedChars('foo: [bar] (baz) - 1 ^ 2')).to.deep.equal(
      'foo\\: \\[bar\\] \\(baz\\) \\- 1 \\^ 2'
    )
  })
  it('should remove unescapable reserved characters', () => {
    expect(escapeReservedChars('1 < 2 > 1')).to.deep.equal('1  2  1')
  })
  it('should not escape non-reserved characters', () => {
    expect(escapeReservedChars(`I'm just a plain old sentence.`)).to.deep.equal(
      `I'm just a plain old sentence.`
    )
  })
})

describe('joinTags', () => {
  it('should return empty string if empty', () => {
    expect(joinTags('all', [])).to.deep.equal('')
  })
  it('should join with AND', () => {
    expect(joinTags('all', ['foo', 'bar'])).to.deep.equal('foo AND bar')
  })
  it('should join with OR', () => {
    expect(joinTags('any', ['foo', 'bar'])).to.deep.equal('foo OR bar')
  })
  it('should join with OR and wrap with NOT', () => {
    expect(joinTags('none', ['foo', 'bar'])).to.deep.equal('NOT (foo OR bar)')
  })
})

describe('tagToQueryString', () => {
  it('should return as-is', () => {
    expect(tagToQueryString({ word: 'foo' })).to.deep.equal('foo')
  })
  it('should handle multiple words with unlimited distance', () => {
    expect(
      tagToQueryString({ word: 'foo bar', distance: 'unlimited' })
    ).to.deep.equal('(foo AND bar)')
  })
  it('should handle multiple words with unlimited distance and more than one space', () => {
    expect(
      tagToQueryString({ word: 'foo    bar    baz', distance: 'unlimited' })
    ).to.deep.equal('(foo AND bar AND baz)')
  })
  it('should handle multiple words with any order', () => {
    expect(
      tagToQueryString({ word: 'foo bar', anyOrder: true, isPhrase: true })
    ).to.deep.equal(`("foo bar" OR "bar foo")`)
  })
})

describe('tagsToQueryString', () => {
  it('should join multiple tags', () => {
    expect(
      tagsToQueryString([{ word: 'foo' }, { word: 'bar' }], 'any')
    ).to.deep.equal('foo OR bar')
  })
  it('should join multiple tags with multi-word text', () => {
    expect(
      tagsToQueryString(
        [{ word: 'foo bar', anyOrder: true, isPhrase: true }, { word: 'baz' }],
        'any'
      )
    ).to.deep.equal(`("foo bar" OR "bar foo") OR baz`)
  })
  it('should only include one word if onlyShowTheseResults is enabled for one tag', () => {
    expect(
      tagsToQueryString(
        [
          { word: 'foo', onlyShowTheseResults: true },
          { word: 'bar' },
          { word: 'baz' },
        ],
        'any'
      )
    ).to.deep.equal('foo')
  })
  it('should only include two words if onlyShowTheseResults is enabled for two tags', () => {
    expect(
      tagsToQueryString(
        [
          { word: 'foo', onlyShowTheseResults: true },
          { word: 'bar', onlyShowTheseResults: true },
          { word: 'baz' },
        ],
        'any'
      )
    ).to.deep.equal('foo OR bar')
  })
})

describe('hasValue', () => {
  it('should be truthy if tags is not empty', () => {
    expect(hasValue({ tags: [{ word: 'foo' }] })).to.deep.equal(1)
  })
})

describe('filter', () => {
  it('should handle multiple tags', () => {
    expect(
      filter({
        tags: [{ word: 'foo' }, { word: 'bar' }],
        join: 'any',
        field: 'titleAndDescription',
      })
    ).to.deep.equal({
      query_string: {
        query: 'foo OR bar',
        default_operator: 'AND',
        default_field: 'titleAndDescription',
      },
    })
  })
  it('should drop untouched', () => {
    expect(
      filter({
        tags: [{ word: 'foo' }],
        join: 'any',
        field: 'titleAndDescription.untouched',
      })
    ).to.deep.equal({
      query_string: {
        query: 'foo',
        default_operator: 'AND',
        default_field: 'titleAndDescription',
      },
    })
  })
  it('should handle exact', () => {
    expect(
      filter({
        tags: [{ word: 'foo' }],
        join: 'any',
        field: 'titleAndDescription',
        exact: true,
      })
    ).to.deep.equal({
      query_string: {
        query: 'foo',
        default_operator: 'AND',
        default_field: 'titleAndDescription.exact',
        analyzer: 'exact',
      },
    })
  })
})
