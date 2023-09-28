import dateIntervalGroupStats from './dateIntervalGroupStats.js'

let { buildQuery, drilldown } = dateIntervalGroupStats

describe('dateIntervalGroupStats', () => {
  it('should buildQuery', () => {
    expect(
      buildQuery({
        key: 'test',
        type: 'dateIntervalGroupStats',
        groupField: 'PO.IssuedDate',
        statsField: 'LineItem.TotalPrice',
      })
    ).toEqual({
      aggs: {
        groups: {
          date_histogram: {
            field: 'PO.IssuedDate',
            calendar_interval: 'year',
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
    ).toEqual({
      aggs: {
        groups: {
          date_histogram: {
            field: 'PO.IssuedDate',
            calendar_interval: 'month',
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
    ).toEqual({
      aggs: {
        groups: {
          date_histogram: {
            field: 'PO.IssuedDate',
            calendar_interval: 'month',
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
        drilldown: '2015-01-01T00:00:00.000Z',
      })
    ).toEqual({
      range: {
        'PO.IssuedDate': {
          gte: '2015-01-01T00:00:00.000Z',
          lte: '2015-01-31T23:59:59Z',
        },
      },
    })
    expect(
      drilldown({
        field: 'PO.IssuedDate',
        interval: 'quarter',
        drilldown: '2015-01-01T00:00:00.000Z',
      })
    ).toEqual({
      range: {
        'PO.IssuedDate': {
          gte: '2015-01-01T00:00:00.000Z',
          lte: '2015-03-31T23:59:59Z',
        },
      },
    })
    expect(
      drilldown({
        field: 'PO.IssuedDate',
        interval: 'year',
        drilldown: '2015-01-01T00:00:00.000Z',
      })
    ).toEqual({
      range: {
        'PO.IssuedDate': {
          gte: '2015-01-01T00:00:00.000Z',
          lte: '2015-12-31T23:59:59Z',
        },
      },
    })
    expect(
      drilldown({
        field: 'PO.IssuedDate',
        interval: 'fiscalYear',
        drilldown: '2015-01-01T00:00:00.000Z',
      })
    ).toEqual({
      __hoistProps: {
        runtime_mappings: {
          'PO.IssuedDate.fiscal': {
            script: {
              params: {
                monthOffset: 3,
              },
              source:
                "if(doc['PO.IssuedDate'].size()!=0){emit(doc['PO.IssuedDate'].value.plusMonths(params['monthOffset']).toInstant().toEpochMilli())}",
            },
            type: 'date',
          },
        },
      },
      range: {
        'PO.IssuedDate.fiscal': {
          gte: '2015-01-01T00:00:00.000Z',
          lte: '2015-12-31T23:59:59Z',
        },
      },
    })
    expect(
      drilldown({
        field: 'PO.IssuedDate',
        interval: 'fiscalQuarter',
        drilldown: '2015-01-01T00:00:00.000Z',
      })
    ).toEqual({
      __hoistProps: {
        runtime_mappings: {
          'PO.IssuedDate.fiscal': {
            script: {
              params: {
                monthOffset: 3,
              },
              source:
                "if(doc['PO.IssuedDate'].size()!=0){emit(doc['PO.IssuedDate'].value.plusMonths(params['monthOffset']).toInstant().toEpochMilli())}",
            },
            type: 'date',
          },
        },
      },
      range: {
        'PO.IssuedDate.fiscal': {
          gte: '2015-01-01T00:00:00.000Z',
          lte: '2015-03-31T23:59:59Z',
        },
      },
    })
  })
  it('Should buildQuery with Federal fiscal interval: Year', () => {
    expect(
      buildQuery({
        key: 'test',
        type: 'dateIntervalGroupStats',
        groupField: 'PO.IssuedDate',
        statsField: 'LineItem.TotalPrice',
        interval: 'fiscalYear',
      })
    ).toEqual({
      aggs: {
        groups: {
          date_histogram: {
            __hoistProps: {
              runtime_mappings: {
                'PO.IssuedDate.fiscal': {
                  script: {
                    params: {
                      monthOffset: 3,
                    },
                    source:
                      "if(doc['PO.IssuedDate'].size()!=0){emit(doc['PO.IssuedDate'].value.plusMonths(params['monthOffset']).toInstant().toEpochMilli())}",
                  },
                  type: 'date',
                },
              },
            },
            field: 'PO.IssuedDate.fiscal',
            calendar_interval: 'year',
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
  it('Should buildQuery with Federal fiscal interval: Quarter', () => {
    expect(
      buildQuery({
        key: 'test',
        type: 'dateIntervalGroupStats',
        groupField: 'PO.IssuedDate',
        statsField: 'LineItem.TotalPrice',
        interval: 'fiscalQuarter',
      })
    ).toEqual({
      aggs: {
        groups: {
          date_histogram: {
            __hoistProps: {
              runtime_mappings: {
                'PO.IssuedDate.fiscal': {
                  script: {
                    params: {
                      monthOffset: 3,
                    },
                    source:
                      "if(doc['PO.IssuedDate'].size()!=0){emit(doc['PO.IssuedDate'].value.plusMonths(params['monthOffset']).toInstant().toEpochMilli())}",
                  },
                  type: 'date',
                },
              },
            },
            field: 'PO.IssuedDate.fiscal',
            calendar_interval: 'quarter',
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
