import {
  buildQuery,
  drilldown,
} from '../../../src/example-types/metricGroups/dateRangesGroupStats.js'

describe('dateRangesGroupStats', () => {
  it('should buildQuery', () => {
    expect(
      buildQuery({
        key: 'test',
        type: 'dateRangesGroupStats',
        groupField: 'PO.IssuedDate',
        statsField: 'LineItem.TotalPrice',
        field: 'PO.IssuedDate',
        ranges: [
          {
            from: '2022-08-02T00:00:00-05:00',
            to: '2022-10-02T00:00:00-05:00',
          },
          {
            from: '2022-10-03T00:00:00-05:00',
            to: '2022-12-03T00:00:00-06:00',
          },
        ],
      })
    ).toEqual({
      aggs: {
        groups: {
          date_range: {
            field: 'PO.IssuedDate',
            ranges: [
              {
                from: '2022-08-02T00:00:00-05:00',
                to: '2022-10-02T00:00:00-05:00',
              },
              {
                from: '2022-10-03T00:00:00-05:00',
                to: '2022-12-03T00:00:00-06:00',
              },
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
  it('should drilldown', () => {
    expect(
      drilldown({
        field: 'PO.IssuedDate',
        type: 'dateRanges',
        ranges: [
          {
            from: '2022-08-02T00:00:00-05:00',
            to: '2022-10-02T00:00:00-05:00',
          },
          {
            from: '2022-10-03T00:00:00-05:00',
            to: '2022-12-03T00:00:00-06:00',
          },
        ],
        drilldown: '2022-08-02T05:00:00.000Z-2022-10-02T05:00:00.000Z',
      })
    ).toEqual({
      range: {
        'PO.IssuedDate': {
          gte: '2022-08-02T05:00:00.000Z',
          lt: '2022-10-02T05:00:00.000Z',
        },
      },
    })
  })
})
