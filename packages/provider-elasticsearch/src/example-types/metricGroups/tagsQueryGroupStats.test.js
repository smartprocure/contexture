import tagsQueryGroupStats from './tagsQueryGroupStats.js'
import { testSchema } from '../testUtils.js'
import { expect, describe, it } from 'vitest'

let { buildQuery } = tagsQueryGroupStats

describe('tagsQueryGroupStats', () => {
  it('should buildQuery', () => {
    let result = buildQuery(
      {
        key: 'test',
        type: 'tagsQueryGroupStats',
        groupField: 'Organization.Name',
        statsField: 'LineItem.TotalPrice',
        tags: [{ word: 'test' }],
      },
      testSchema('Organization.Name')
    )
    expect(result).toEqual({
      aggs: {
        groups: {
          filters: {
            filters: {
              test: {
                query_string: {
                  query: 'test',
                  default_operator: 'AND',
                  default_field: 'Organization.Name',
                },
              },
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
    })
  })
})
