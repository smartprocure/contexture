let {
  buildQuery,
} = require('../../../src/example-types/metricGroups/numberRangesGroupStats')
let { expect } = require('chai')

describe('numberRangesGroupStats', () => {
  it('should buildQuery', () => {
    expect(
      buildQuery({
        key: 'test',
        type: 'numberRangesGroupStats',
        groupField: 'LineItem.UnitPrice',
        statsField: 'LineItem.TotalPrice',
        ranges: [
          { from: '0', to: '500' },
          { from: '500', to: '10000' },
        ],
      })
    ).to.eql({
      aggs: {
        groups: {
          range: {
            field: 'LineItem.UnitPrice',
            ranges: [
              { from: '0', to: '500' },
              { from: '500', to: '10000' },
            ],
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
