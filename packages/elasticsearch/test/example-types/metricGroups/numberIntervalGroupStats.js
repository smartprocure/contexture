let {
  buildQuery,
} = require('../../../src/example-types/metricGroups/numberIntervalGroupStats')
let { expect } = require('chai')

describe('numberIntervalGroupStats', () => {
  it('should buildQuery', async () => {
    expect(
      await buildQuery({
        key: 'test',
        type: 'numberIntervalGroupStats',
        groupField: 'LineItem.UnitPrice',
        statsField: 'LineItem.TotalPrice',
        interval: 100,
      })
    ).to.eql({
      aggs: {
        groups: {
          histogram: {
            field: 'LineItem.UnitPrice',
            interval: 100,
            min_doc_count: 0,
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
  it('should buildQuery with smartInterval', async () => {
    expect(
      await buildQuery(
        {
          key: 'test',
          type: 'numberIntervalGroupStats',
          groupField: 'LineItem.UnitPrice',
          statsField: 'LineItem.TotalPrice',
          interval: 'smart',
        },
        () => ({ min: 10, max: 5000 })
      )
    ).to.eql({
      aggs: {
        groups: {
          histogram: {
            field: 'LineItem.UnitPrice',
            interval: 250,
            min_doc_count: 0,
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
