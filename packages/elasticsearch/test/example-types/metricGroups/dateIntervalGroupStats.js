let {
  buildQuery,
  drilldown,
} = require('../../../src/example-types/metricGroups/dateIntervalGroupStats')
let { expect } = require('chai')

describe('dateIntervalGroupStats', () => {
  it('should buildQuery', () => {
    expect(
      buildQuery({
        key: 'test',
        type: 'dateIntervalGroupStats',
        groupField: 'PO.IssuedDate',
        statsField: 'LineItem.TotalPrice',
      })
    ).to.eql({
      aggs: {
        groups: {
          date_histogram: {
            field: 'PO.IssuedDate',
            interval: 'year',
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
  it('should buildQuery with interval', () => {
    expect(
      buildQuery({
        key: 'test',
        type: 'dateIntervalGroupStats',
        groupField: 'PO.IssuedDate',
        statsField: 'LineItem.TotalPrice',
        interval: 'month',
      })
    ).to.eql({
      aggs: {
        groups: {
          date_histogram: {
            field: 'PO.IssuedDate',
            interval: 'month',
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
  it('should buildQuery without aggs if there is no statsField', () => {
    expect(
      buildQuery({
        key: 'test',
        type: 'dateIntervalGroupStats',
        groupField: 'PO.IssuedDate',
        interval: 'month',
      })
    ).to.eql({
      aggs: {
        groups: {
          date_histogram: {
            field: 'PO.IssuedDate',
            interval: 'month',
            min_doc_count: 0,
          },
        },
      },
    })
  })
  it('should drilldown', () => {
    expect(
      drilldown({
        field: 'PO.IssuedDate',
        interval: 'month',
        drilldown: '2015-01-01T00:00:00.000Z'
      })
    ).to.eql({
      range: {
        'PO.IssuedDate': {
          gte: '2015-01-01T00:00:00.000Z',
          lte: '2015-01-31T23:59:59Z'
        }    
      }
    })
    expect(
      drilldown({
        field: 'PO.IssuedDate',
        interval: 'quarter',
        drilldown: '2015-01-01T00:00:00.000Z'
      })
    ).to.eql({
      range: {
        'PO.IssuedDate': {
          gte: '2015-01-01T00:00:00.000Z',
          lte: '2015-03-31T23:59:59Z'
        }    
      }
    })
    expect(
      drilldown({
        field: 'PO.IssuedDate',
        interval: 'year',
        drilldown: '2015-01-01T00:00:00.000Z'
      })
    ).to.eql({
      range: {
        'PO.IssuedDate': {
          gte: '2015-01-01T00:00:00.000Z',
          lte: '2015-12-31T23:59:59Z'
        }    
      }
    })
  })
})
