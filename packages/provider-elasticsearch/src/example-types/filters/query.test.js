import query from './query.js'
import { expect, describe, it } from 'vitest'

describe('query', () => {
  it('should filter properly', () => {
    expect(
      query.filter({
        key: 'test',
        type: 'query',
        field: '_all',
        query: 'cable',
      })
    ).toEqual({
      query_string: {
        query: 'cable',
        default_operator: 'AND',
        default_field: '_all',
      },
    })
    expect(
      query.filter({
        key: 'test',
        type: 'query',
        field: '_all',
        query: 'cable',
        exact: true,
      })
    ).toEqual({
      query_string: {
        query: 'cable',
        default_operator: 'AND',
        default_field: '_all.exact',
        analyzer: 'exact',
      },
    })
  })
})
