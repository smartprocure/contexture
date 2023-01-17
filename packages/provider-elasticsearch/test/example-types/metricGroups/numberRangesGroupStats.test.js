let {
  buildQuery,
  buildGroupQuery,
  drilldown,
} = require('../../../src/example-types/metricGroups/numberRangesGroupStats')

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
    ).toEqual({
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
  it('should buildGroupQuery with filtered ranges if drilldown is passed', () => {
    expect(
      buildGroupQuery(
        {
          key: 'test',
          type: 'numberRangesGroupStats',
          field: 'LineItem.UnitPrice',
          ranges: [
            { from: '0', to: '500' },
            { from: '500', to: '10000' },
          ],
        },
        {},
        'columns',
        {},
        () => {},
        '500.0-10000.0'
      )
    ).toEqual({
      aggs: {
        columns: {
          range: {
            field: 'LineItem.UnitPrice',
            ranges: [
              {
                from: '500',
                to: '10000',
              },
            ],
          },
        },
      },
    })
  })
  it('should drilldown', () => {
    expect(
      drilldown({
        key: 'test',
        type: 'numberRangesGroupStats',
        field: 'LineItem.UnitPrice',
        ranges: [
          { from: '0.0', to: '500.0' },
          { from: '500.0', to: '10000.0' },
        ],
        drilldown: '500.0-10000.0',
      })
    ).toEqual({
      range: {
        'LineItem.UnitPrice': {
          gte: '500.0',
          lt: '10000.0',
        },
      },
    })
  })
})
