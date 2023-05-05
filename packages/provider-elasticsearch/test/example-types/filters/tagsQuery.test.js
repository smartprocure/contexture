import tagsQuery from '../../../src/example-types/filters/tagsQuery.js'
import _ from 'lodash/fp.js'

let {
  wordPermutations,
  limitResultsToCertainTags,
  addQuotesAndDistance,
  replaceReservedChars,
  joinTags,
  tagToQueryString,
  tagsToQueryString,
  hasValue,
  filter,
  buildResultQuery,
  result,
} = tagsQuery(()=>[])


describe('wordPermutations', () => {
  it('should handle empty string', () => {
    expect(wordPermutations('')).toEqual([''])
  })
  it('should handle one word', () => {
    expect(wordPermutations('foo')).toEqual(['foo'])
  })
  it('should handle two words', () => {
    expect(wordPermutations('foo bar')).toEqual(['foo bar', 'bar foo'])
  })
})

describe('limitResultsToCertainTags', () => {
  it('should return truthy if found', () => {
    expect(
      limitResultsToCertainTags([{ onlyShowTheseResults: true }, {}])
    ).toBeDefined()
  })
})

describe('addQuotesAndDistance', () => {
  it('should work as `isPhrase` if text includes empty space', () => {
    let tag = { word: 'foo bar', distance: 3 }
    expect(addQuotesAndDistance(tag, 'foo bar')).toEqual(`"foo bar"~3`)
  })
  it('should quote if is phrase', () => {
    expect(addQuotesAndDistance({ isPhrase: true }, 'foo bar')).toEqual(
      `"foo bar"`
    )
  })
  it('should quote and not set distance if distance is 0', () => {
    expect(
      addQuotesAndDistance({ isPhrase: true, distance: 0 }, 'foo bar')
    ).toEqual(`"foo bar"`)
  })
  it('should quote and set distance if distance is > 0', () => {
    expect(
      addQuotesAndDistance({ isPhrase: true, distance: 2 }, 'foo bar')
    ).toEqual(`"foo bar"~2`)
  })
  it('should add ~1 for misspellings', () => {
    expect(addQuotesAndDistance({ misspellings: true }, 'foo')).toEqual(`foo~1`)
  })
})

describe('replaceReservedChars', () => {
  it('should replace reserved characters with empty space', () => {
    expect(
      replaceReservedChars('foo: [bar] (baz) - 1 ^ 2 <> 3 !$ 4,5')
    ).toEqual('foo   bar   baz    1   2    3    4 5')
  })
})

describe('joinTags', () => {
  it('should return empty string if empty', () => {
    expect(joinTags('all', [])).toEqual('')
  })
  it('should join with AND', () => {
    expect(joinTags('all', ['foo', 'bar'])).toEqual('foo AND bar')
  })
  it('should join with OR', () => {
    expect(joinTags('any', ['foo', 'bar'])).toEqual('foo OR bar')
  })
  it('should join with OR and wrap with NOT', () => {
    expect(joinTags('none', ['foo', 'bar'])).toEqual('NOT (foo OR bar)')
  })
})

describe('tagToQueryString', () => {
  it('should return as-is', () => {
    expect(tagToQueryString({ word: 'foo' })).toEqual('foo')
  })
  it('should handle multiple words with unlimited distance', () => {
    expect(
      tagToQueryString({ word: 'foo bar', distance: 'unlimited' })
    ).toEqual('(foo AND bar)')
  })
  it('should handle multiple words with unlimited distance and more than one space', () => {
    expect(
      tagToQueryString({ word: 'foo    bar    baz', distance: 'unlimited' })
    ).toEqual('(foo AND bar AND baz)')
  })
  it('should handle multiple words with any order', () => {
    expect(
      tagToQueryString({ word: 'foo bar', anyOrder: true, isPhrase: true })
    ).toEqual(`("foo bar" OR "bar foo")`)
  })
})

describe('tagsToQueryString', () => {
  it('should join multiple tags', () => {
    expect(
      tagsToQueryString([{ word: 'foo' }, { word: 'bar' }], 'any')
    ).toEqual('foo OR bar')
  })
  it('should join multiple tags with multi-word text', () => {
    expect(
      tagsToQueryString(
        [{ word: 'foo bar', anyOrder: true, isPhrase: true }, { word: 'baz' }],
        'any'
      )
    ).toEqual(`("foo bar" OR "bar foo") OR baz`)
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
    ).toEqual('foo')
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
    ).toEqual('foo OR bar')
  })
})

describe('hasValue', () => {
  it('should be truthy if tags is not empty', () => {
    expect(hasValue({ tags: [{ word: 'foo' }] })).toEqual(1)
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
    ).toEqual({
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
    ).toEqual({
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
    ).toEqual({
      query_string: {
        query: 'foo',
        default_operator: 'AND',
        default_field: 'titleAndDescription.exact',
        analyzer: 'exact',
      },
    })
  })
})

describe('buildResultQuery', () => {
  it('should construct a correct basic agg when just the node prop is provided', () => {
    let node = {
      tags: [{ word: 'foo' }, { word: 'bar' }],
      field: 'baz',
      join: 'and',
    }
    expect(buildResultQuery(node)).toEqual({
      aggs: {
        tags: {
          filters: {
            filters: {
              foo: {
                query_string: {
                  query: 'foo',
                  default_operator: 'AND',
                  default_field: 'baz',
                },
              },
              bar: {
                query_string: {
                  query: 'bar',
                  default_operator: 'AND',
                  default_field: 'baz',
                },
              },
            },
          },
        },
      },
    })
  })
  it('should spread the children aggs when they are provided', () => {
    let node = {
      tags: [{ word: 'foo' }, { word: 'bar' }],
      field: 'baz',
      join: 'and',
    }
    let children = {
      aggs: {
        groups: {
          terms: {
            field: 'Organization.Name',
            size: 10,
            order: { max: 'asc' },
          },
          aggs: {
            min: { min: { field: 'LineItem.TotalPrice' } },
            max: { max: { field: 'LineItem.TotalPrice' } },
            avg: { avg: { field: 'LineItem.TotalPrice' } },
            sum: { sum: { field: 'LineItem.TotalPrice' } },
          },
        },
      },
    }
    expect(buildResultQuery(node, children)).toEqual({
      aggs: {
        tags: {
          filters: {
            filters: {
              foo: {
                query_string: {
                  query: 'foo',
                  default_operator: 'AND',
                  default_field: 'baz',
                },
              },
              bar: {
                query_string: {
                  query: 'bar',
                  default_operator: 'AND',
                  default_field: 'baz',
                },
              },
            },
          },
          aggs: {
            groups: {
              terms: {
                field: 'Organization.Name',
                size: 10,
                order: {
                  max: 'asc',
                },
              },
              aggs: {
                min: { min: { field: 'LineItem.TotalPrice' } },
                max: { max: { field: 'LineItem.TotalPrice' } },
                avg: { avg: { field: 'LineItem.TotalPrice' } },
                sum: { sum: { field: 'LineItem.TotalPrice' } },
              },
            },
          },
        },
      },
    })
  })
  it('should set the proper `groupsKey` when provided', () => {
    let node = {
      tags: [{ word: 'foo' }, { word: 'bar' }],
      field: 'baz',
      join: 'and',
    }
    let groupsKey = 'columns'
    expect(buildResultQuery(node, {}, groupsKey)).toEqual({
      aggs: {
        columns: {
          filters: {
            filters: {
              foo: {
                query_string: {
                  query: 'foo',
                  default_operator: 'AND',
                  default_field: 'baz',
                },
              },
              bar: {
                query_string: {
                  query: 'bar',
                  default_operator: 'AND',
                  default_field: 'baz',
                },
              },
            },
          },
        },
      },
    })
  })
})

describe('result', () => {
  it('result should query tag counts', async () => {
    expect(
      await result(
        {
          field: 'baz',
          tags: [{ word: 'foo' }, { word: 'bar' }],
        },
        _.constant({
          aggregations: {
            tags: {
              buckets: {
                foo: { doc_count: 2 },
                bar: { doc_count: 5 },
              },
            },
          },
        })
      )
    ).toEqual({ 'keywordGenerations': {}, 'tags': {foo: 2, bar: 5 }})
  })
})
