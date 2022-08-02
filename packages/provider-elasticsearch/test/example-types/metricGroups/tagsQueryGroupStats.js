let {
  buildQuery,
  // buildGroupQuery,
} = require('../../../src/example-types/metricGroups/tagsQueryGroupStats')
let { expect } = require('chai')
let { testSchema } = require('../testUtils')

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
    expect(result).to.eql({
      aggs: {
        groups: {
          filters: {
            filters: {
              test: {
                query_string: {
                  default_field: 'Organization.Name',
                  default_operator: 'AND',
                  query: 'test',
                },
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
    })
  })
})
