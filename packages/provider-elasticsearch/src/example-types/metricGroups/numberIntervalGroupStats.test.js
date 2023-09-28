import numberIntervalGroupStats from './numberIntervalGroupStats.js'

let { buildQuery, drilldown } = numberIntervalGroupStats

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
    ).toEqual({
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
        null,
        () => ({ min: 10, max: 5000 })
      )
    ).toEqual({
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
  it('should drilldown', async () => {
    expect(
      await drilldown({
        field: 'LineItem.TotalPrice',
        interval: 5000,
        drilldown: 0,
      })
    ).toEqual({
      range: { 'LineItem.TotalPrice': { gte: 0, lt: 5000 } },
    })
  })
  it('should drilldown with smartInterval', async () => {
    expect(
      await drilldown(
        {
          field: 'LineItem.TotalPrice',
          interval: 'smart',
          drilldown: 0,
        },
        null,
        // This result makes interval 250, see above test
        () => ({ min: 10, max: 5000 })
      )
    ).toEqual({
      range: { 'LineItem.TotalPrice': { gte: 0, lt: 250 } },
    })
  })
})
