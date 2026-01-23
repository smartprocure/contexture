import { describe, expect, it } from 'vitest'
import { getSortParameter } from './index.js'

describe(getSortParameter, () => {
  it('defaults to sorting on score', () => {
    const actual = getSortParameter({})
    const expected = { _score: 'desc' }
    expect(actual).toEqual(expected)
  })

  it('sort on multiple fields', () => {
    const actual = getSortParameter({
      sort: [{ field: 'name' }, { field: 'age', desc: true }],
      sortField: 'city',
      sortDir: 'asc',
    })
    const expected = { name: 'asc', age: 'desc' }
    expect(actual).toEqual(expected)
  })

  it('sort on multiple subfields', () => {
    const actual = getSortParameter(
      {
        sort: [{ field: 'name' }, { field: 'age', desc: true }],
        sortField: 'city',
        sortDir: 'asc',
      },
      {
        fields: {
          name: { elasticsearch: { notAnalyzedField: 'keyword' } },
          age: { elasticsearch: { notAnalyzedField: 'keyword' } },
        },
      }
    )
    const expected = { 'name.keyword': 'asc', 'age.keyword': 'desc' }
    expect(actual).toEqual(expected)
  })

  it('legacy sort on single field', () => {
    const actual = getSortParameter({
      sortField: 'name',
      sortDir: 'asc',
    })
    const expected = { name: 'asc' }
    expect(actual).toEqual(expected)
  })

  it('legacy sort on single subfield', () => {
    const actual = getSortParameter(
      {
        sortField: 'name',
        sortDir: 'asc',
      },
      {
        fields: {
          name: { elasticsearch: { notAnalyzedField: 'keyword' } },
        },
      }
    )
    const expected = { 'name.keyword': 'asc' }
    expect(actual).toEqual(expected)
  })
})
