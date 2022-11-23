let _ = require('lodash/fp')
let {
  filter,
  createPivotScope,
} = require('../../../src/example-types/metricGroups/pivot')
let { testSchema, testSchemas } = require('../testUtils')
let pivotResponse = require('./pivotData/pivotResponse')
let pivotRepsonseWithFilteredFieldValueGroup = require('./pivotData/pivotRepsonseWithFilteredFieldValueGroup')
let columnResponse = require('./pivotData/columnResponse')
let columnResult = require('./pivotData/columnResult')
let stringify = require('json-stable-stringify')

let pivotTestNode = node => ({
  key: 'test',
  type: 'pivot',
  values: [{ type: 'sum', field: 'LineItem.TotalPrice' }],
  rows: [
    { type: 'fieldValues', field: 'Organization.State' },
    { type: 'fieldValues', field: 'Organization.NameState' },
  ],
  columns: [{ type: 'dateInterval', field: 'PO.IssuedDate', interval: 'year' }],
  extensions: [],
  ...node,
})

let getStats = () => {}

let rowsExpansion = {
  type: 'rows',
  drilldown: ['New York'],
  loaded: false,
}

let rootPivotRequest = {
  type: 'rows',
  columns: {
    drilldown: [],
    totals: true,
  },
  rows: {
    drilldown: [],
    totals: true,
  },
}

// pass aggsForValues in each stage
describe('pivot', () => {
  it('aggsForValues', () => {
    let { getAggsForValues } = createPivotScope(pivotTestNode(), {}, getStats)
    let values = [
      { type: 'min', field: 'LineItem.TotalPrice' },
      { type: 'max', field: 'LineItem.TotalPrice' },
      { type: 'avg', field: 'LineItem.TotalPrice' },
      { type: 'sum', field: 'LineItem.TotalPrice' },
    ]
    expect(getAggsForValues(values)).toEqual({
      'pivotMetric-min-LineItem.TotalPrice': {
        min: { field: 'LineItem.TotalPrice' },
      },
      'pivotMetric-max-LineItem.TotalPrice': {
        max: { field: 'LineItem.TotalPrice' },
      },
      'pivotMetric-avg-LineItem.TotalPrice': {
        avg: { field: 'LineItem.TotalPrice' },
      },
      'pivotMetric-sum-LineItem.TotalPrice': {
        sum: { field: 'LineItem.TotalPrice' },
      },
    })
  })
  it('aggsForValues with not analyzed field form schemas', () => {
    let values = [{ type: 'cardinality', field: 'Vendor.Name' }]
    let { getAggsForValues } = createPivotScope(
      pivotTestNode(),
      testSchema('Vendor.Name'),
      getStats
    )
    expect(getAggsForValues(values)).toEqual({
      'pivotMetric-cardinality-Vendor.Name': {
        cardinality: { field: 'Vendor.Name.untouched' },
      },
    })
  })
  it('should buildQuery', async () => {
    // ES -> PVT
    // buckets -> groups (rows/columns)
    // metrics -> values
    let { buildQuery } = createPivotScope(
      pivotTestNode({
        values: [
          // labels are `${_.startCase(type)} of ${schemaLabel(field)}`
          // key - defaults to `${type}-${field}`
          //    unless type has a special override? e.g. if doesnt take field, like top_hits
          { type: 'min', field: 'LineItem.TotalPrice' },
          { type: 'max', field: 'LineItem.TotalPrice' },
          { type: 'avg', field: 'LineItem.TotalPrice' },
          { type: 'sum', field: 'LineItem.TotalPrice' },
          {
            type: 'percentiles',
            field: 'LineItem.TotalPrice',
            percents: [20, 50],
          },
          { type: 'cardinality', field: 'Vendor.Name' },
          { type: 'topHits' },
        ],
        columns: [],
        rows: [
          { type: 'fieldValues', field: 'Organization.NameState' },
          { type: 'dateInterval', field: 'PO.IssuedDate', interval: 'month' },
        ],
        expanded: { columns: true, rows: true },
      }),
      testSchemas(['Organization.NameState', 'Vendor.Name']),
      getStats
    )

    let expected = {
      aggs: {
        rows: {
          terms: { field: 'Organization.NameState.untouched', size: 10 },
          aggs: {
            rows: {
              date_histogram: {
                field: 'PO.IssuedDate',
                interval: 'month',
                min_doc_count: 0,
              },
              aggs: {
                'pivotMetric-min-LineItem.TotalPrice': {
                  min: { field: 'LineItem.TotalPrice' },
                },
                'pivotMetric-max-LineItem.TotalPrice': {
                  max: { field: 'LineItem.TotalPrice' },
                },
                'pivotMetric-avg-LineItem.TotalPrice': {
                  avg: { field: 'LineItem.TotalPrice' },
                },
                'pivotMetric-sum-LineItem.TotalPrice': {
                  sum: { field: 'LineItem.TotalPrice' },
                },
                'pivotMetric-percentiles-LineItem.TotalPrice': {
                  percentiles: {
                    percents: [20, 50],
                    field: 'LineItem.TotalPrice',
                  },
                },
                'pivotMetric-cardinality-Vendor.Name': {
                  cardinality: { field: 'Vendor.Name.untouched' },
                },
                'pivotMetric-topHits': { top_hits: {} },
              },
            },
            'pivotMetric-min-LineItem.TotalPrice': {
              min: { field: 'LineItem.TotalPrice' },
            },
            'pivotMetric-max-LineItem.TotalPrice': {
              max: { field: 'LineItem.TotalPrice' },
            },
            'pivotMetric-avg-LineItem.TotalPrice': {
              avg: { field: 'LineItem.TotalPrice' },
            },
            'pivotMetric-sum-LineItem.TotalPrice': {
              sum: { field: 'LineItem.TotalPrice' },
            },
            'pivotMetric-percentiles-LineItem.TotalPrice': {
              percentiles: {
                percents: [20, 50],
                field: 'LineItem.TotalPrice',
              },
            },
            'pivotMetric-cardinality-Vendor.Name': {
              cardinality: { field: 'Vendor.Name.untouched' },
            },
            'pivotMetric-topHits': { top_hits: {} },
          },
        },
        'pivotMetric-min-LineItem.TotalPrice': {
          min: { field: 'LineItem.TotalPrice' },
        },
        'pivotMetric-max-LineItem.TotalPrice': {
          max: { field: 'LineItem.TotalPrice' },
        },
        'pivotMetric-avg-LineItem.TotalPrice': {
          avg: { field: 'LineItem.TotalPrice' },
        },
        'pivotMetric-sum-LineItem.TotalPrice': {
          sum: { field: 'LineItem.TotalPrice' },
        },
        'pivotMetric-percentiles-LineItem.TotalPrice': {
          percentiles: {
            percents: [20, 50],
            field: 'LineItem.TotalPrice',
          },
        },
        'pivotMetric-cardinality-Vendor.Name': {
          cardinality: { field: 'Vendor.Name.untouched' },
        },
        'pivotMetric-topHits': { top_hits: {} },
      },
      track_total_hits: true,
    }
    let result = await buildQuery(rootPivotRequest)
    expect(result).toEqual(expected)
  })
  it('should buildQuery for fieldValuePartition', async () => {
    let { buildQuery } = createPivotScope(
      pivotTestNode({
        values: [{ type: 'sum', field: 'LineItem.TotalPrice' }],
        columns: [],
        rows: [
          {
            type: 'fieldValuePartition',
            field: 'Vendor.City',
            matchValue: 'Washington',
          },
        ],
      }),
      testSchemas(['Vendor.City']),
      getStats
    )

    let expected = {
      track_total_hits: true,
      aggs: {
        rows: {
          filters: {
            other_bucket_key: 'fail',
            filters: {
              pass: { term: { 'Vendor.City.untouched': 'Washington' } },
            },
          },
          aggs: {
            'pivotMetric-sum-LineItem.TotalPrice': {
              sum: { field: 'LineItem.TotalPrice' },
            },
          },
        },
        'pivotMetric-sum-LineItem.TotalPrice': {
          sum: { field: 'LineItem.TotalPrice' },
        },
      },
    }
    let result = await buildQuery(rootPivotRequest)
    expect(result).toEqual(expected)
  })
  it('should buildQuery for fieldValues', async () => {
    let { buildQuery } = createPivotScope(
      pivotTestNode({
        values: [{ type: 'sum', field: 'LineItem.TotalPrice' }],
        columns: [],
        rows: [
          {
            type: 'fieldValues',
            field: 'Organization.Name',
            filter: 'city',
          },
        ],
      }),
      testSchemas(['Vendor.City']),
      getStats
    )

    let expected = {
      track_total_hits: true,
      aggs: {
        valueFilter: {
          filter: {
            bool: {
              must: [
                {
                  regexp: {
                    'Organization.Name': {
                      value: '.*(city).*',
                      case_insensitive: true,
                    },
                  },
                },
              ],
            },
          },
          aggs: {
            rows: {
              terms: { field: 'Organization.Name', size: 10 },
              aggs: {
                'pivotMetric-sum-LineItem.TotalPrice': {
                  sum: { field: 'LineItem.TotalPrice' },
                },
              },
            },
          },
        },
        'pivotMetric-sum-LineItem.TotalPrice': {
          sum: { field: 'LineItem.TotalPrice' },
        },
      },
    }
    let result = await buildQuery(rootPivotRequest)
    expect(result).toEqual(expected)
  })
  it('should buildQuery for fieldValues with drilldown', async () => {
    // TODO: add tests for dateInterval, numberInterval, fieldValuePartition
    // TODO: test keyForRow (e.g. month for date interval)
    let { buildQuery } = createPivotScope(
      pivotTestNode({
        values: [{ type: 'sum', field: 'LineItem.TotalPrice' }],
        columns: [],
        rows: [
          {
            type: 'fieldValues',
            field: 'Organization.Name',
            drilldown: 'Reno',
          },
          {
            type: 'numberRanges',
            field: 'LineItem.TotalPrice',
            ranges: [
              { from: '0', to: '500' },
              { from: '500', to: '10000' },
            ],
            drilldown: '0.0-500.0',
          },
        ],
      }),
      testSchemas(['Organization.Name', 'Organization.State']),
      getStats
    )

    let { buildQuery: buildQueryMultiTerm } = createPivotScope(
      pivotTestNode({
        values: [{ type: 'sum', field: 'LineItem.TotalPrice' }],
        columns: [],
        rows: [
          {
            type: 'fieldValues',
            field: 'Organization.Name',
            additionalFields: ['Organization.State'],
          },
          {
            type: 'numberRanges',
            field: 'LineItem.TotalPrice',
            ranges: [
              { from: '0', to: '500' },
              { from: '500', to: '10000' },
            ],
          },
        ],
      }),
      testSchemas(['Organization.Name', 'Organization.State']),
      getStats
    )

    let expectedTopLevel = {
      aggs: {
        'pivotMetric-sum-LineItem.TotalPrice': {
          sum: { field: 'LineItem.TotalPrice' },
        },
        pivotFilter: {
          filter: {
            bool: {
              must: [{ term: { 'Organization.Name.untouched': 'Reno' } }],
            },
          },
          aggs: {
            rows: {
              terms: { field: 'Organization.Name.untouched', size: 10 },
              aggs: {
                'pivotMetric-sum-LineItem.TotalPrice': {
                  sum: { field: 'LineItem.TotalPrice' },
                },
              },
            },
          },
        },
      },
      track_total_hits: true,
    }
    let expectedDrilldown = {
      track_total_hits: true,
      aggs: {
        pivotFilter: {
          filter: {
            bool: {
              must: [
                { term: { 'Organization.Name.untouched': 'Reno' } },
                {
                  range: {
                    'LineItem.TotalPrice': {
                      gte: '0.0',
                      lt: '500.0',
                    },
                  },
                },
              ],
            },
          },
          aggs: {
            rows: {
              terms: { field: 'Organization.Name.untouched', size: 10 },
              aggs: {
                rows: {
                  range: {
                    field: 'LineItem.TotalPrice',
                    ranges: [
                      { from: '0', to: '500' },
                      { from: '500', to: '10000' },
                    ],
                  },
                  aggs: {
                    'pivotMetric-sum-LineItem.TotalPrice': {
                      sum: { field: 'LineItem.TotalPrice' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }
    let expectedMultiTermDrilldown = {
      track_total_hits: true,
      aggs: {
        pivotFilter: {
          filter: {
            bool: {
              must: [
                { term: { 'Organization.Name.untouched': 'Reno' } },
                {
                  term: {
                    'Organization.State.untouched': 'NV',
                  },
                },
                {
                  range: {
                    'LineItem.TotalPrice': {
                      gte: '0.0',
                      lt: '500.0',
                    },
                  },
                },
              ],
            },
          },
          aggs: {
            rows: {
              multi_terms: {
                size: 10,
                terms: [
                  {
                    field: 'Organization.Name.untouched',
                  },
                  {
                    field: 'Organization.State.untouched',
                  },
                ],
              },
              aggs: {
                rows: {
                  range: {
                    field: 'LineItem.TotalPrice',
                    ranges: [
                      { from: '0', to: '500' },
                      { from: '500', to: '10000' },
                    ],
                  },
                  aggs: {
                    'pivotMetric-sum-LineItem.TotalPrice': {
                      sum: { field: 'LineItem.TotalPrice' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }
    let resultTopLevel = await buildQuery({
      type: 'rows',
      rows: {
        drilldown: [],
        totals: true,
      },
      columns: {},
    })
    expect(resultTopLevel).toEqual(expectedTopLevel)
    let resultDrilldownLevel = await buildQuery({
      type: 'rows',
      rows: {
        drilldown: ['Reno', '0.0-500.0'],
      },
      columns: {},
    })
    expect(resultDrilldownLevel).toEqual(expectedDrilldown)

    let resultMultiTermDrilldownLevel = await buildQueryMultiTerm({
      type: 'rows',
      rows: {
        drilldown: ['Reno|NV', '0.0-500.0'],
      },
      columns: {},
    })
    expect(resultMultiTermDrilldownLevel).toEqual(expectedMultiTermDrilldown)
  })
  it('should buildQuery for fieldValues with drilldown and limited depth', async () => {
    let { buildQuery } = createPivotScope(
      pivotTestNode({
        values: [{ type: 'sum', field: 'LineItem.TotalPrice' }],
        columns: [],
        rows: [
          {
            type: 'fieldValues',
            field: 'Organization.Name',
          },
          {
            type: 'numberRanges',
            field: 'LineItem.TotalPrice',
            ranges: [
              { from: '0', to: '500' },
              { from: '500', to: '10000' },
            ],
          },
          {
            type: 'fieldValues',
            field: 'Organization.Type',
          },
        ],
      }),
      testSchemas(['Vendor.City']),
      getStats
    )
    let expected = {
      track_total_hits: true,
      aggs: {
        rows: {
          terms: { field: 'Organization.Name', size: 10 },
          aggs: {
            'pivotMetric-sum-LineItem.TotalPrice': {
              sum: { field: 'LineItem.TotalPrice' },
            },
          },
        },
        'pivotMetric-sum-LineItem.TotalPrice': {
          sum: { field: 'LineItem.TotalPrice' },
        },
      },
    }
    let result = await buildQuery({
      type: 'rows',
      rows: {
        drilldown: [],
        totals: true,
      },
    })
    expect(result).toEqual(expected)
  })
  it('should buildQuery for fieldValues with drilldown and limited depth (deeper)', async () => {
    let { buildQuery } = createPivotScope(
      pivotTestNode({
        values: [{ type: 'sum', field: 'LineItem.TotalPrice' }],
        columns: [],
        rows: [
          {
            type: 'fieldValues',
            field: 'Organization.Name',
          },
          {
            type: 'numberRanges',
            field: 'LineItem.TotalPrice',
            ranges: [
              { from: '0', to: '500' },
              { from: '500', to: '10000' },
            ],
          },
          {
            type: 'fieldValues',
            field: 'Organization.Type',
          },
        ],
      }),
      testSchemas(['Vendor.City']),
      getStats
    )

    let expected = {
      track_total_hits: true,
      aggs: {
        pivotFilter: {
          filter: {
            bool: { must: [{ term: { 'Organization.Name': 'Reno' } }] },
          },
          aggs: {
            rows: {
              terms: { field: 'Organization.Name', size: 10 },
              aggs: {
                rows: {
                  range: {
                    field: 'LineItem.TotalPrice',
                    ranges: [
                      { from: '0', to: '500' },
                      { from: '500', to: '10000' },
                    ],
                  },
                  aggs: {
                    'pivotMetric-sum-LineItem.TotalPrice': {
                      sum: { field: 'LineItem.TotalPrice' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }
    let result = await buildQuery({
      type: 'rows',
      rows: {
        drilldown: ['Reno'],
      },
      columns: {},
    })
    expect(result).toEqual(expected)
  })
  it('should buildQuery for fieldValues with drilldown (deepest)', async () => {
    let { buildQuery } = createPivotScope(
      pivotTestNode({
        values: [{ type: 'sum', field: 'LineItem.TotalPrice' }],
        columns: [],
        rows: [
          {
            type: 'fieldValues',
            field: 'Organization.Name',
          },
          {
            type: 'numberRanges',
            field: 'LineItem.TotalPrice',
            ranges: [
              { from: '0', to: '500' },
              { from: '500', to: '10000' },
            ],
          },
          {
            type: 'fieldValues',
            field: 'Organization.Type',
          },
        ],
      }),
      testSchemas(['Vendor.City']),
      getStats
    )
    let expected = {
      aggs: {
        pivotFilter: {
          filter: {
            bool: {
              must: [
                {
                  term: {
                    'Organization.Name': 'Reno',
                  },
                },
                {
                  range: {
                    'LineItem.TotalPrice': {
                      gte: '0.0',
                      lt: '500.0',
                    },
                  },
                },
                {
                  term: {
                    'Organization.Type': 'A - U.S. OWNED BUSINESS',
                  },
                },
              ],
            },
          },
          aggs: {
            rows: {
              terms: {
                field: 'Organization.Name',
                size: 10,
              },
              aggs: {
                rows: {
                  range: {
                    field: 'LineItem.TotalPrice',
                    ranges: [
                      {
                        from: '0',
                        to: '500',
                      },
                      {
                        from: '500',
                        to: '10000',
                      },
                    ],
                  },
                  aggs: {
                    rows: {
                      terms: {
                        field: 'Organization.Type',
                        size: 10,
                      },
                      aggs: {
                        'pivotMetric-sum-LineItem.TotalPrice': {
                          sum: {
                            field: 'LineItem.TotalPrice',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      track_total_hits: true,
    }
    let result = await buildQuery({
      type: 'rows',
      rows: {
        drilldown: ['Reno', '0.0-500.0', 'A - U.S. OWNED BUSINESS'],
      },
    })
    expect(result).toEqual(expected)
  })
  it('should buildQuery for fieldValues with drilldown and skip pagination', async () => {
    let expansion = {
      type: 'rows',
      drilldown: ['Reno', '0.0-500.0'],
      loaded: false,
    }
    let { getInitialRequest, buildQuery } = createPivotScope(
      pivotTestNode({
        values: [{ type: 'sum', field: 'LineItem.TotalPrice' }],
        columns: [],
        rows: [
          {
            type: 'fieldValues',
            field: 'Organization.Name',
          },
          {
            type: 'numberRanges',
            field: 'LineItem.TotalPrice',
            ranges: [
              { from: '0', to: '500' },
              { from: '500', to: '10000' },
            ],
          },
          {
            type: 'fieldValues',
            field: 'Organization.Type',
          },
        ],
        expansions: [
          {
            type: 'columns',
            drilldown: [],
            loaded: [],
          },
          {
            type: 'rows',
            drilldown: ['Reno', '0.0-500.0'],
            loaded: ['A - U.S. OWNED BUSINESS'],
          },
          expansion,
        ],
      }),
      testSchemas(['Vendor.City']),
      getStats
    )

    let expected = {
      aggs: {
        pivotFilter: {
          filter: {
            bool: {
              must: [
                {
                  term: {
                    'Organization.Name': 'Reno',
                  },
                },
                {
                  range: {
                    'LineItem.TotalPrice': {
                      gte: '0.0',
                      lt: '500.0',
                    },
                  },
                },
              ],
              must_not: [
                {
                  term: {
                    'Organization.Type': 'A - U.S. OWNED BUSINESS',
                  },
                },
              ],
            },
          },
          aggs: {
            rows: {
              terms: {
                field: 'Organization.Name',
                size: 10,
              },
              aggs: {
                rows: {
                  range: {
                    field: 'LineItem.TotalPrice',
                    ranges: [
                      {
                        from: '0',
                        to: '500',
                      },
                      {
                        from: '500',
                        to: '10000',
                      },
                    ],
                  },
                  aggs: {
                    rows: {
                      terms: {
                        field: 'Organization.Type',
                        size: 10,
                      },
                      aggs: {
                        'pivotMetric-sum-LineItem.TotalPrice': {
                          sum: {
                            field: 'LineItem.TotalPrice',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      track_total_hits: true,
    }
    let result = await buildQuery(getInitialRequest(expansion))
    expect(result).toEqual(expected)
  })
  it('should buildQuery for fieldValues with drilldown and loaded', async () => {
    let expansion = {
      type: 'rows',
      drilldown: ['Reno', '0.0-500.0'],
      loaded: false,
    }
    let { getInitialRequest, buildQuery } = createPivotScope(
      pivotTestNode({
        values: [{ type: 'sum', field: 'LineItem.TotalPrice' }],
        columns: [
          {
            type: 'fieldValues',
            field: 'Organization.State',
          },
        ],
        rows: [
          {
            type: 'fieldValues',
            field: 'Organization.Name',
          },
          {
            type: 'numberRanges',
            field: 'LineItem.TotalPrice',
            ranges: [
              { from: '0', to: '500' },
              { from: '500', to: '10000' },
            ],
          },
          {
            type: 'fieldValues',
            field: 'Organization.Type',
          },
        ],
        expansions: [
          {
            type: 'columns',
            drilldown: [],
            loaded: ['New York', 'Florida'],
          },
          {
            type: 'rows',
            drilldown: ['Reno', '0.0-500.0'],
            loaded: ['A - U.S. OWNED BUSINESS'],
          },
          expansion,
        ],
      }),
      testSchemas(['Vendor.City']),
      getStats
    )
    let expected = {
      aggs: {
        pivotFilter: {
          filter: {
            bool: {
              must: [
                {
                  term: {
                    'Organization.Name': 'Reno',
                  },
                },
                {
                  range: {
                    'LineItem.TotalPrice': {
                      gte: '0.0',
                      lt: '500.0',
                    },
                  },
                },
              ],
              must_not: [
                {
                  term: {
                    'Organization.Type': 'A - U.S. OWNED BUSINESS',
                  },
                },
              ],
            },
          },
          aggs: {
            rows: {
              terms: {
                field: 'Organization.Name',
                size: 10,
              },
              aggs: {
                rows: {
                  range: {
                    field: 'LineItem.TotalPrice',
                    ranges: [
                      {
                        from: '0',
                        to: '500',
                      },
                      {
                        from: '500',
                        to: '10000',
                      },
                    ],
                  },
                  aggs: {
                    rows: {
                      terms: {
                        field: 'Organization.Type',
                        size: 10,
                      },
                      aggs: {
                        pivotFilter: {
                          aggs: {
                            columns: {
                              aggs: {
                                'pivotMetric-sum-LineItem.TotalPrice': {
                                  sum: {
                                    field: 'LineItem.TotalPrice',
                                  },
                                },
                              },
                              terms: {
                                field: 'Organization.State',
                                size: 10,
                              },
                            },
                          },
                          filter: {
                            bool: {
                              must: [
                                {
                                  bool: {
                                    minimum_should_match: 1,
                                    should: [
                                      {
                                        term: {
                                          'Organization.State': 'New York',
                                        },
                                      },
                                      {
                                        term: {
                                          'Organization.State': 'Florida',
                                        },
                                      },
                                    ],
                                  },
                                },
                              ],
                            },
                          },
                        },
                        'pivotMetric-sum-LineItem.TotalPrice': {
                          sum: {
                            field: 'LineItem.TotalPrice',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      track_total_hits: true,
    }

    let result = await buildQuery(getInitialRequest(expansion))
    expect(result).toEqual(expected)
  })
  it('should buildQuery for smart numberInterval to show getStats works', async () => {
    let { buildQuery } = createPivotScope(
      pivotTestNode({
        values: [{ type: 'sum', field: 'LineItem.TotalPrice' }],
        columns: [],
        rows: [
          {
            type: 'numberInterval',
            field: 'LineItem.UnitPrice',
            interval: 'smart',
          },
        ],
        expanded: { columns: true, rows: true },
      }),
      testSchemas(['Organization.NameState', 'Organization.State']),
      () => ({ min: 10, max: 500 })
    )
    let expected = {
      track_total_hits: true,
      aggs: {
        rows: {
          histogram: {
            field: 'LineItem.UnitPrice',
            interval: 25,
            min_doc_count: 0,
          },
          aggs: {
            'pivotMetric-sum-LineItem.TotalPrice': {
              sum: { field: 'LineItem.TotalPrice' },
            },
          },
        },
        'pivotMetric-sum-LineItem.TotalPrice': {
          sum: { field: 'LineItem.TotalPrice' },
        },
      },
    }
    let result = await buildQuery(rootPivotRequest)
    expect(result).toEqual(expected)
  })
  it('should buildQuery with subtotals', async () => {
    // ES -> PVT
    // buckets -> rows (rows/columns)
    // metrics -> values
    let { buildQuery } = createPivotScope(
      pivotTestNode({
        values: [
          { type: 'min', field: 'LineItem.TotalPrice' },
          { type: 'max', field: 'LineItem.TotalPrice' },
          { type: 'avg', field: 'LineItem.TotalPrice' },
          { type: 'sum', field: 'LineItem.TotalPrice' },
        ],
        columns: [],
        rows: [
          { type: 'fieldValues', field: 'Organization.NameState' },
          { type: 'dateInterval', field: 'PO.IssuedDate', interval: 'month' },
        ],
        expanded: { columns: true, rows: true },
      }),
      testSchemas(['Organization.NameState', 'Organization.State']),
      getStats
    )
    let expected = {
      track_total_hits: true,
      aggs: {
        rows: {
          terms: { field: 'Organization.NameState.untouched', size: 10 },
          aggs: {
            rows: {
              date_histogram: {
                field: 'PO.IssuedDate',
                interval: 'month',
                min_doc_count: 0,
              },
              aggs: {
                'pivotMetric-min-LineItem.TotalPrice': {
                  min: { field: 'LineItem.TotalPrice' },
                },
                'pivotMetric-max-LineItem.TotalPrice': {
                  max: { field: 'LineItem.TotalPrice' },
                },
                'pivotMetric-avg-LineItem.TotalPrice': {
                  avg: { field: 'LineItem.TotalPrice' },
                },
                'pivotMetric-sum-LineItem.TotalPrice': {
                  sum: { field: 'LineItem.TotalPrice' },
                },
              },
            },
            'pivotMetric-min-LineItem.TotalPrice': {
              min: { field: 'LineItem.TotalPrice' },
            },
            'pivotMetric-max-LineItem.TotalPrice': {
              max: { field: 'LineItem.TotalPrice' },
            },
            'pivotMetric-avg-LineItem.TotalPrice': {
              avg: { field: 'LineItem.TotalPrice' },
            },
            'pivotMetric-sum-LineItem.TotalPrice': {
              sum: { field: 'LineItem.TotalPrice' },
            },
          },
        },
        'pivotMetric-min-LineItem.TotalPrice': {
          min: { field: 'LineItem.TotalPrice' },
        },
        'pivotMetric-max-LineItem.TotalPrice': {
          max: { field: 'LineItem.TotalPrice' },
        },
        'pivotMetric-avg-LineItem.TotalPrice': {
          avg: { field: 'LineItem.TotalPrice' },
        },
        'pivotMetric-sum-LineItem.TotalPrice': {
          sum: { field: 'LineItem.TotalPrice' },
        },
      },
    }
    let result = await buildQuery(rootPivotRequest)
    expect(result).toEqual(expected)
  })
  it('should buildQuery for tagsQuery', async () => {
    let { buildQuery } = createPivotScope(
      pivotTestNode({
        values: [{ type: 'sum', field: 'LineItem.TotalPrice' }],
        columns: [],
        rows: [
          {
            type: 'tagsQuery',
            field: 'Organization.Name',
            tags: [{ word: 'test' }],
          },
        ],
        expanded: { columns: true, rows: true },
      }),
      testSchemas(['Organization.NameState', 'Organization.State']),
      getStats
    )
    let expected = {
      aggs: {
        rows: {
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
            'pivotMetric-sum-LineItem.TotalPrice': {
              sum: {
                field: 'LineItem.TotalPrice',
              },
            },
          },
        },
        'pivotMetric-sum-LineItem.TotalPrice': {
          sum: {
            field: 'LineItem.TotalPrice',
          },
        },
      },
      track_total_hits: true,
    }
    let result = await buildQuery(rootPivotRequest)
    expect(result).toEqual(expected)
  })
  it('should buildQuery with more types', async () => {
    let { buildQuery } = createPivotScope(
      pivotTestNode({
        values: [
          { type: 'min', field: 'LineItem.TotalPrice' },
          { type: 'max', field: 'LineItem.TotalPrice' },
          { type: 'avg', field: 'LineItem.TotalPrice' },
          { type: 'sum', field: 'LineItem.TotalPrice' },
        ],
        columns: [],
        rows: [
          { type: 'fieldValues', field: 'Organization.State' },
          { type: 'fieldValues', field: 'Organization.NameState' },
          {
            type: 'numberRanges',
            field: 'LineItem.TotalPrice',
            ranges: [
              { from: '0', to: '500' },
              { from: '500', to: '10000' },
            ],
          },
        ],
        expanded: { columns: true, rows: true },
      }),
      testSchemas(['Organization.NameState', 'Organization.State']),
      getStats
    )
    let expected = {
      aggs: {
        rows: {
          terms: { field: 'Organization.State.untouched', size: 10 },
          aggs: {
            rows: {
              terms: { field: 'Organization.NameState.untouched', size: 10 },
              aggs: {
                rows: {
                  range: {
                    field: 'LineItem.TotalPrice',
                    ranges: [
                      { from: '0', to: '500' },
                      { from: '500', to: '10000' },
                    ],
                  },
                  aggs: {
                    'pivotMetric-min-LineItem.TotalPrice': {
                      min: { field: 'LineItem.TotalPrice' },
                    },
                    'pivotMetric-max-LineItem.TotalPrice': {
                      max: { field: 'LineItem.TotalPrice' },
                    },
                    'pivotMetric-avg-LineItem.TotalPrice': {
                      avg: { field: 'LineItem.TotalPrice' },
                    },
                    'pivotMetric-sum-LineItem.TotalPrice': {
                      sum: { field: 'LineItem.TotalPrice' },
                    },
                  },
                },
                'pivotMetric-min-LineItem.TotalPrice': {
                  min: { field: 'LineItem.TotalPrice' },
                },
                'pivotMetric-max-LineItem.TotalPrice': {
                  max: { field: 'LineItem.TotalPrice' },
                },
                'pivotMetric-avg-LineItem.TotalPrice': {
                  avg: { field: 'LineItem.TotalPrice' },
                },
                'pivotMetric-sum-LineItem.TotalPrice': {
                  sum: { field: 'LineItem.TotalPrice' },
                },
              },
            },
            'pivotMetric-min-LineItem.TotalPrice': {
              min: { field: 'LineItem.TotalPrice' },
            },
            'pivotMetric-max-LineItem.TotalPrice': {
              max: { field: 'LineItem.TotalPrice' },
            },
            'pivotMetric-avg-LineItem.TotalPrice': {
              avg: { field: 'LineItem.TotalPrice' },
            },
            'pivotMetric-sum-LineItem.TotalPrice': {
              sum: { field: 'LineItem.TotalPrice' },
            },
          },
        },
        'pivotMetric-min-LineItem.TotalPrice': {
          min: { field: 'LineItem.TotalPrice' },
        },
        'pivotMetric-max-LineItem.TotalPrice': {
          max: { field: 'LineItem.TotalPrice' },
        },
        'pivotMetric-avg-LineItem.TotalPrice': {
          avg: { field: 'LineItem.TotalPrice' },
        },
        'pivotMetric-sum-LineItem.TotalPrice': {
          sum: { field: 'LineItem.TotalPrice' },
        },
      },
      track_total_hits: true,
    }

    let result = await buildQuery(rootPivotRequest)
    expect(result).toEqual(expected)
  })
  it('should buildQuery with pivot columns', async () => {
    let { buildQuery } = createPivotScope(
      pivotTestNode({
        values: [
          { type: 'min', field: 'LineItem.TotalPrice' },
          { type: 'max', field: 'LineItem.TotalPrice' },
          { type: 'avg', field: 'LineItem.TotalPrice' },
          { type: 'sum', field: 'LineItem.TotalPrice' },
        ],
        columns: [
          { type: 'dateInterval', field: 'PO.IssuedDate', interval: 'year' },
        ],
        rows: [
          { type: 'fieldValues', field: 'Organization.State' },
          { type: 'fieldValues', field: 'Organization.NameState' },
          {
            type: 'numberRanges',
            field: 'LineItem.TotalPrice',
            ranges: [
              { from: '0', to: '500' },
              { from: '500', to: '10000' },
            ],
          },
        ],
        expanded: { columns: true, rows: true },
      }),
      testSchemas(['Organization.NameState', 'Organization.State']),
      getStats
    )

    let expected = {
      aggs: {
        rows: {
          terms: { field: 'Organization.State.untouched', size: 10 },
          aggs: {
            rows: {
              terms: { field: 'Organization.NameState.untouched', size: 10 },
              aggs: {
                rows: {
                  range: {
                    field: 'LineItem.TotalPrice',
                    ranges: [
                      { from: '0', to: '500' },
                      { from: '500', to: '10000' },
                    ],
                  },
                  aggs: {
                    columns: {
                      date_histogram: {
                        field: 'PO.IssuedDate',
                        interval: 'year',
                        min_doc_count: 0,
                      },
                      aggs: {
                        'pivotMetric-min-LineItem.TotalPrice': {
                          min: { field: 'LineItem.TotalPrice' },
                        },
                        'pivotMetric-max-LineItem.TotalPrice': {
                          max: { field: 'LineItem.TotalPrice' },
                        },
                        'pivotMetric-avg-LineItem.TotalPrice': {
                          avg: { field: 'LineItem.TotalPrice' },
                        },
                        'pivotMetric-sum-LineItem.TotalPrice': {
                          sum: { field: 'LineItem.TotalPrice' },
                        },
                      },
                    },
                    'pivotMetric-min-LineItem.TotalPrice': {
                      min: { field: 'LineItem.TotalPrice' },
                    },
                    'pivotMetric-max-LineItem.TotalPrice': {
                      max: { field: 'LineItem.TotalPrice' },
                    },
                    'pivotMetric-avg-LineItem.TotalPrice': {
                      avg: { field: 'LineItem.TotalPrice' },
                    },
                    'pivotMetric-sum-LineItem.TotalPrice': {
                      sum: { field: 'LineItem.TotalPrice' },
                    },
                  },
                },
                columns: {
                  date_histogram: {
                    field: 'PO.IssuedDate',
                    interval: 'year',
                    min_doc_count: 0,
                  },
                  aggs: {
                    'pivotMetric-min-LineItem.TotalPrice': {
                      min: { field: 'LineItem.TotalPrice' },
                    },
                    'pivotMetric-max-LineItem.TotalPrice': {
                      max: { field: 'LineItem.TotalPrice' },
                    },
                    'pivotMetric-avg-LineItem.TotalPrice': {
                      avg: { field: 'LineItem.TotalPrice' },
                    },
                    'pivotMetric-sum-LineItem.TotalPrice': {
                      sum: { field: 'LineItem.TotalPrice' },
                    },
                  },
                },
                'pivotMetric-min-LineItem.TotalPrice': {
                  min: { field: 'LineItem.TotalPrice' },
                },
                'pivotMetric-max-LineItem.TotalPrice': {
                  max: { field: 'LineItem.TotalPrice' },
                },
                'pivotMetric-avg-LineItem.TotalPrice': {
                  avg: { field: 'LineItem.TotalPrice' },
                },
                'pivotMetric-sum-LineItem.TotalPrice': {
                  sum: { field: 'LineItem.TotalPrice' },
                },
              },
            },
            columns: {
              date_histogram: {
                field: 'PO.IssuedDate',
                interval: 'year',
                min_doc_count: 0,
              },
              aggs: {
                'pivotMetric-min-LineItem.TotalPrice': {
                  min: { field: 'LineItem.TotalPrice' },
                },
                'pivotMetric-max-LineItem.TotalPrice': {
                  max: { field: 'LineItem.TotalPrice' },
                },
                'pivotMetric-avg-LineItem.TotalPrice': {
                  avg: { field: 'LineItem.TotalPrice' },
                },
                'pivotMetric-sum-LineItem.TotalPrice': {
                  sum: { field: 'LineItem.TotalPrice' },
                },
              },
            },
            'pivotMetric-min-LineItem.TotalPrice': {
              min: { field: 'LineItem.TotalPrice' },
            },
            'pivotMetric-max-LineItem.TotalPrice': {
              max: { field: 'LineItem.TotalPrice' },
            },
            'pivotMetric-avg-LineItem.TotalPrice': {
              avg: { field: 'LineItem.TotalPrice' },
            },
            'pivotMetric-sum-LineItem.TotalPrice': {
              sum: { field: 'LineItem.TotalPrice' },
            },
          },
        },
        columns: {
          date_histogram: {
            field: 'PO.IssuedDate',
            interval: 'year',
            min_doc_count: 0,
          },
          aggs: {
            'pivotMetric-min-LineItem.TotalPrice': {
              min: { field: 'LineItem.TotalPrice' },
            },
            'pivotMetric-max-LineItem.TotalPrice': {
              max: { field: 'LineItem.TotalPrice' },
            },
            'pivotMetric-avg-LineItem.TotalPrice': {
              avg: { field: 'LineItem.TotalPrice' },
            },
            'pivotMetric-sum-LineItem.TotalPrice': {
              sum: { field: 'LineItem.TotalPrice' },
            },
          },
        },
        'pivotMetric-min-LineItem.TotalPrice': {
          min: { field: 'LineItem.TotalPrice' },
        },
        'pivotMetric-max-LineItem.TotalPrice': {
          max: { field: 'LineItem.TotalPrice' },
        },
        'pivotMetric-avg-LineItem.TotalPrice': {
          avg: { field: 'LineItem.TotalPrice' },
        },
        'pivotMetric-sum-LineItem.TotalPrice': {
          sum: { field: 'LineItem.TotalPrice' },
        },
      },
      track_total_hits: true,
    }
    let result = await buildQuery(rootPivotRequest)
    expect(result).toEqual(expected)
  })
  it('should buildQuery with pivot columns and subtotals', async () => {
    let { buildQuery } = createPivotScope(
      pivotTestNode({
        values: [{ type: 'sum', field: 'LineItem.TotalPrice' }],
        rows: [
          { type: 'fieldValues', field: 'Organization.State' },
          { type: 'fieldValues', field: 'Organization.NameState' },
        ],
        columns: [
          { type: 'dateInterval', field: 'PO.IssuedDate', interval: 'year' },
        ],
        expanded: { columns: true, rows: true },
      }),
      testSchemas(['Organization.NameState', 'Organization.State']),
      getStats
    )

    let expected = {
      track_total_hits: true,
      aggs: {
        rows: {
          terms: { field: 'Organization.State.untouched', size: 10 },
          aggs: {
            rows: {
              terms: { field: 'Organization.NameState.untouched', size: 10 },
              aggs: {
                columns: {
                  date_histogram: {
                    field: 'PO.IssuedDate',
                    interval: 'year',
                    min_doc_count: 0,
                  },
                  aggs: {
                    'pivotMetric-sum-LineItem.TotalPrice': {
                      sum: { field: 'LineItem.TotalPrice' },
                    },
                  },
                },
                'pivotMetric-sum-LineItem.TotalPrice': {
                  sum: { field: 'LineItem.TotalPrice' },
                },
              },
            },
            columns: {
              date_histogram: {
                field: 'PO.IssuedDate',
                interval: 'year',
                min_doc_count: 0,
              },
              aggs: {
                'pivotMetric-sum-LineItem.TotalPrice': {
                  sum: { field: 'LineItem.TotalPrice' },
                },
              },
            },
            'pivotMetric-sum-LineItem.TotalPrice': {
              sum: { field: 'LineItem.TotalPrice' },
            },
          },
        },
        columns: {
          date_histogram: {
            field: 'PO.IssuedDate',
            interval: 'year',
            min_doc_count: 0,
          },
          aggs: {
            'pivotMetric-sum-LineItem.TotalPrice': {
              sum: { field: 'LineItem.TotalPrice' },
            },
          },
        },
        'pivotMetric-sum-LineItem.TotalPrice': {
          sum: { field: 'LineItem.TotalPrice' },
        },
      },
    }
    let result = await buildQuery(rootPivotRequest)
    expect(result).toEqual(expected)
  })
  it('should buildQuery with nested pivot column and sort', async () => {
    let { buildQuery } = createPivotScope(
      pivotTestNode({
        values: [{ type: 'sum', field: 'PO.IssuedAmount' }],
        rows: [
          {
            type: 'fieldValues',
            field: 'Organization.State',
            // Should be ignored if sort is set on the top-level
            sort: { field: '_count' },
          },
        ],
        columns: [
          { type: 'dateInterval', field: 'PO.IssuedDate', interval: 'year' },
        ],
        sort: {
          columnValues: ['2022'],
          valueIndex: 0,
          direction: 'asc',
        },
        expanded: { columns: true, rows: true },
      }),
      testSchemas(['Organization.NameState', 'Organization.State']),
      getStats
    )

    let expected = {
      aggs: {
        rows: {
          terms: {
            field: 'Organization.State.untouched',
            size: 10,
            order: { 'sortFilter>metric': 'asc' },
          },
          aggs: {
            sortFilter: {
              filter: {
                bool: {
                  must: [
                    {
                      range: {
                        'PO.IssuedDate': {
                          gte: '2022',
                          lte: '2022-12-31T23:59:59Z',
                        },
                      },
                    },
                  ],
                },
              },
              aggs: { metric: { sum: { field: 'PO.IssuedAmount' } } },
            },
            columns: {
              date_histogram: {
                field: 'PO.IssuedDate',
                interval: 'year',
                min_doc_count: 0,
              },
              aggs: {
                'pivotMetric-sum-PO.IssuedAmount': {
                  sum: { field: 'PO.IssuedAmount' },
                },
              },
            },
            'pivotMetric-sum-PO.IssuedAmount': {
              sum: { field: 'PO.IssuedAmount' },
            },
          },
        },
        columns: {
          date_histogram: {
            field: 'PO.IssuedDate',
            interval: 'year',
            min_doc_count: 0,
          },
          aggs: {
            'pivotMetric-sum-PO.IssuedAmount': {
              sum: { field: 'PO.IssuedAmount' },
            },
          },
        },
        'pivotMetric-sum-PO.IssuedAmount': {
          sum: { field: 'PO.IssuedAmount' },
        },
      },
      track_total_hits: true,
    }
    let result = await buildQuery(rootPivotRequest)
    expect(result).toEqual(expected)
  })
  it('should buildQuery and sort on the row if top-level sort is missing', async () => {
    let { buildQuery } = createPivotScope(
      pivotTestNode({
        values: [{ type: 'sum', field: 'PO.IssuedAmount' }],
        rows: [
          {
            type: 'fieldValues',
            field: 'Organization.State',
            sort: { field: '_key', direction: 'asc' },
          },
        ],
        columns: [
          { type: 'dateInterval', field: 'PO.IssuedDate', interval: 'year' },
        ],
        expanded: { columns: true, rows: true },
      }),
      testSchemas(['Organization.NameState', 'Organization.State']),
      getStats
    )

    let expected = {
      aggs: {
        rows: {
          terms: {
            field: 'Organization.State.untouched',
            size: 10,
            order: {
              _key: 'asc',
            },
          },
          aggs: {
            columns: {
              date_histogram: {
                field: 'PO.IssuedDate',
                interval: 'year',
                min_doc_count: 0,
              },
              aggs: {
                'pivotMetric-sum-PO.IssuedAmount': {
                  sum: { field: 'PO.IssuedAmount' },
                },
              },
            },
            'pivotMetric-sum-PO.IssuedAmount': {
              sum: { field: 'PO.IssuedAmount' },
            },
          },
        },
        columns: {
          date_histogram: {
            field: 'PO.IssuedDate',
            interval: 'year',
            min_doc_count: 0,
          },
          aggs: {
            'pivotMetric-sum-PO.IssuedAmount': {
              sum: { field: 'PO.IssuedAmount' },
            },
          },
        },
        'pivotMetric-sum-PO.IssuedAmount': {
          sum: { field: 'PO.IssuedAmount' },
        },
      },
      track_total_hits: true,
    }
    let result = await buildQuery(rootPivotRequest)
    expect(result).toEqual(expected)
  })
  it('should buildQuery and sort on nth value metric', async () => {
    let { buildQuery } = createPivotScope(
      pivotTestNode({
        values: [
          { type: 'sum', field: 'PO.IssuedAmount' },
          { type: 'avg', field: 'PO.IssuedAmount' },
        ],
        rows: [{ type: 'fieldValues', field: 'Organization.State' }],
        columns: [
          { type: 'dateInterval', field: 'PO.IssuedDate', interval: 'year' },
        ],
        sort: {
          columnValues: ['2022'],
          valueIndex: 1,
          direction: 'asc',
        },
        expanded: { columns: true, rows: true },
      }),
      testSchemas(['Organization.NameState', 'Organization.State']),
      getStats
    )

    let expected = {
      aggs: {
        rows: {
          terms: {
            field: 'Organization.State.untouched',
            size: 10,
            order: {
              'sortFilter>metric': 'asc',
            },
          },
          aggs: {
            sortFilter: {
              filter: {
                bool: {
                  must: [
                    {
                      range: {
                        'PO.IssuedDate': {
                          gte: '2022',
                          lte: '2022-12-31T23:59:59Z',
                        },
                      },
                    },
                  ],
                },
              },
              aggs: {
                metric: {
                  avg: {
                    field: 'PO.IssuedAmount',
                  },
                },
              },
            },
            columns: {
              date_histogram: {
                field: 'PO.IssuedDate',
                interval: 'year',
                min_doc_count: 0,
              },
              aggs: {
                'pivotMetric-sum-PO.IssuedAmount': {
                  sum: {
                    field: 'PO.IssuedAmount',
                  },
                },
                'pivotMetric-avg-PO.IssuedAmount': {
                  avg: {
                    field: 'PO.IssuedAmount',
                  },
                },
              },
            },
            'pivotMetric-sum-PO.IssuedAmount': {
              sum: { field: 'PO.IssuedAmount' },
            },
            'pivotMetric-avg-PO.IssuedAmount': {
              avg: {
                field: 'PO.IssuedAmount',
              },
            },
          },
        },
        columns: {
          date_histogram: {
            field: 'PO.IssuedDate',
            interval: 'year',
            min_doc_count: 0,
          },
          aggs: {
            'pivotMetric-sum-PO.IssuedAmount': {
              sum: { field: 'PO.IssuedAmount' },
            },
            'pivotMetric-avg-PO.IssuedAmount': {
              avg: {
                field: 'PO.IssuedAmount',
              },
            },
          },
        },
        'pivotMetric-sum-PO.IssuedAmount': {
          sum: { field: 'PO.IssuedAmount' },
        },
        'pivotMetric-avg-PO.IssuedAmount': {
          avg: {
            field: 'PO.IssuedAmount',
          },
        },
      },
      track_total_hits: true,
    }

    let result = await buildQuery(rootPivotRequest)
    expect(result).toEqual(expected)
  })
  it('should buildQuery and sort with no columns', async () => {
    let { buildQuery } = createPivotScope(
      pivotTestNode({
        values: [
          { type: 'sum', field: 'PO.IssuedAmount' },
          { type: 'avg', field: 'PO.IssuedAmount' },
        ],
        rows: [{ type: 'fieldValues', field: 'Organization.State' }],
        columns: [
          { type: 'dateInterval', field: 'PO.IssuedDate', interval: 'year' },
        ],
        sort: { valueIndex: 1, direction: 'asc' },
        expanded: { columns: true, rows: true },
      }),
      testSchemas(['Organization.NameState', 'Organization.State']),
      getStats
    )
    let expected = {
      aggs: {
        rows: {
          terms: {
            field: 'Organization.State.untouched',
            size: 10,
            order: { metric: 'asc' },
          },
          aggs: {
            columns: {
              date_histogram: {
                field: 'PO.IssuedDate',
                interval: 'year',
                min_doc_count: 0,
              },
              aggs: {
                'pivotMetric-sum-PO.IssuedAmount': {
                  sum: { field: 'PO.IssuedAmount' },
                },
                'pivotMetric-avg-PO.IssuedAmount': {
                  avg: { field: 'PO.IssuedAmount' },
                },
              },
            },
            'pivotMetric-sum-PO.IssuedAmount': {
              sum: { field: 'PO.IssuedAmount' },
            },
            'pivotMetric-avg-PO.IssuedAmount': {
              avg: { field: 'PO.IssuedAmount' },
            },
            metric: { avg: { field: 'PO.IssuedAmount' } },
          },
        },
        columns: {
          date_histogram: {
            field: 'PO.IssuedDate',
            interval: 'year',
            min_doc_count: 0,
          },
          aggs: {
            'pivotMetric-sum-PO.IssuedAmount': {
              sum: { field: 'PO.IssuedAmount' },
            },
            'pivotMetric-avg-PO.IssuedAmount': {
              avg: { field: 'PO.IssuedAmount' },
            },
          },
        },
        'pivotMetric-sum-PO.IssuedAmount': {
          sum: { field: 'PO.IssuedAmount' },
        },
        'pivotMetric-avg-PO.IssuedAmount': {
          avg: { field: 'PO.IssuedAmount' },
        },
      },
      track_total_hits: true,
    }

    let result = await buildQuery(rootPivotRequest)
    expect(result).toEqual(expected)
  })
  it('should buildQuery and sort on document count without valueIndex', async () => {
    let { buildQuery } = createPivotScope(
      pivotTestNode({
        values: [
          { type: 'sum', field: 'PO.IssuedAmount' },
          { type: 'avg', field: 'PO.IssuedAmount' },
        ],
        rows: [{ type: 'fieldValues', field: 'Organization.State' }],
        columns: [
          { type: 'dateInterval', field: 'PO.IssuedDate', interval: 'year' },
        ],
        sort: { valueIndex: null, direction: 'asc' },
        expanded: { columns: true, rows: true },
      }),
      testSchemas(['Organization.NameState', 'Organization.State']),
      getStats
    )
    let expected = {
      aggs: {
        rows: {
          terms: {
            field: 'Organization.State.untouched',
            size: 10,
            order: { _count: 'asc' },
          },
          aggs: {
            columns: {
              date_histogram: {
                field: 'PO.IssuedDate',
                interval: 'year',
                min_doc_count: 0,
              },
              aggs: {
                'pivotMetric-sum-PO.IssuedAmount': {
                  sum: { field: 'PO.IssuedAmount' },
                },
                'pivotMetric-avg-PO.IssuedAmount': {
                  avg: { field: 'PO.IssuedAmount' },
                },
              },
            },
            'pivotMetric-sum-PO.IssuedAmount': {
              sum: { field: 'PO.IssuedAmount' },
            },
            'pivotMetric-avg-PO.IssuedAmount': {
              avg: { field: 'PO.IssuedAmount' },
            },
          },
        },
        columns: {
          date_histogram: {
            field: 'PO.IssuedDate',
            interval: 'year',
            min_doc_count: 0,
          },
          aggs: {
            'pivotMetric-sum-PO.IssuedAmount': {
              sum: { field: 'PO.IssuedAmount' },
            },
            'pivotMetric-avg-PO.IssuedAmount': {
              avg: { field: 'PO.IssuedAmount' },
            },
          },
        },
        'pivotMetric-sum-PO.IssuedAmount': {
          sum: { field: 'PO.IssuedAmount' },
        },
        'pivotMetric-avg-PO.IssuedAmount': {
          avg: { field: 'PO.IssuedAmount' },
        },
      },
      track_total_hits: true,
    }
    let result = await buildQuery(rootPivotRequest)
    expect(result).toEqual(expected)
  })
  it('should buildQuery with multiple columns and sorting on multiple columns', async () => {
    let { buildQuery } = createPivotScope(
      pivotTestNode({
        values: [{ type: 'sum', field: 'PO.IssuedAmount' }],
        rows: [{ type: 'fieldValues', field: 'Organization.State' }],
        columns: [
          { type: 'dateInterval', field: 'PO.IssuedDate', interval: 'year' },
          { type: 'dateInterval', field: 'PO.IssuedDate', interval: 'month' },
        ],
        sort: {
          columnValues: ['2022', '2022-02-01'],
          valueIndex: 0,
          direction: 'asc',
        },
        expanded: { columns: true, rows: true },
      }),
      testSchemas(['Organization.NameState', 'Organization.State']),
      getStats
    )

    let expected = {
      aggs: {
        rows: {
          terms: {
            field: 'Organization.State.untouched',
            size: 10,
            order: { 'sortFilter>metric': 'asc' },
          },
          aggs: {
            sortFilter: {
              filter: {
                bool: {
                  must: [
                    {
                      range: {
                        'PO.IssuedDate': {
                          gte: '2022',
                          lte: '2022-12-31T23:59:59Z',
                        },
                      },
                    },
                    {
                      range: {
                        'PO.IssuedDate': {
                          gte: '2022-02-01',
                          lte: '2022-02-28T23:59:59Z',
                        },
                      },
                    },
                  ],
                },
              },
              aggs: { metric: { sum: { field: 'PO.IssuedAmount' } } },
            },
            columns: {
              date_histogram: {
                field: 'PO.IssuedDate',
                interval: 'year',
                min_doc_count: 0,
              },
              aggs: {
                columns: {
                  date_histogram: {
                    field: 'PO.IssuedDate',
                    interval: 'month',
                    min_doc_count: 0,
                  },
                  aggs: {
                    'pivotMetric-sum-PO.IssuedAmount': {
                      sum: { field: 'PO.IssuedAmount' },
                    },
                  },
                },
                'pivotMetric-sum-PO.IssuedAmount': {
                  sum: { field: 'PO.IssuedAmount' },
                },
              },
            },
            'pivotMetric-sum-PO.IssuedAmount': {
              sum: { field: 'PO.IssuedAmount' },
            },
          },
        },
        columns: {
          date_histogram: {
            field: 'PO.IssuedDate',
            interval: 'year',
            min_doc_count: 0,
          },
          aggs: {
            columns: {
              date_histogram: {
                field: 'PO.IssuedDate',
                interval: 'month',
                min_doc_count: 0,
              },
              aggs: {
                'pivotMetric-sum-PO.IssuedAmount': {
                  sum: { field: 'PO.IssuedAmount' },
                },
              },
            },
            'pivotMetric-sum-PO.IssuedAmount': {
              sum: { field: 'PO.IssuedAmount' },
            },
          },
        },
        'pivotMetric-sum-PO.IssuedAmount': {
          sum: { field: 'PO.IssuedAmount' },
        },
      },
      track_total_hits: true,
    }

    let result = await buildQuery(rootPivotRequest)
    expect(result).toEqual(expected)
  })
  it('should buildQuery with multiple rows, columns, and sort', async () => {
    let { buildQuery } = createPivotScope(
      pivotTestNode({
        values: [{ type: 'stats', field: 'PO.IssuedAmount' }],
        rows: [
          { type: 'fieldValues', field: 'Organization.State' },
          { type: 'fieldValues', field: 'Organization.NameState' },
        ],
        columns: [
          { type: 'dateInterval', field: 'PO.IssuedDate', interval: 'year' },
        ],
        sort: {
          columnValues: ['2022'],
          valueIndex: 0,
          valueProp: 'max',
          direction: 'desc',
        },
        expanded: { columns: true, rows: true },
      }),
      testSchemas(['Organization.NameState', 'Organization.State']),
      getStats
    )
    let expected = {
      aggs: {
        rows: {
          terms: {
            field: 'Organization.State.untouched',
            size: 10,
            order: { 'sortFilter>metric.max': 'desc' },
          },
          aggs: {
            sortFilter: {
              filter: {
                bool: {
                  must: [
                    {
                      range: {
                        'PO.IssuedDate': {
                          gte: '2022',
                          lte: '2022-12-31T23:59:59Z',
                        },
                      },
                    },
                  ],
                },
              },
              aggs: { metric: { stats: { field: 'PO.IssuedAmount' } } },
            },
            rows: {
              terms: {
                field: 'Organization.NameState.untouched',
                size: 10,
                order: { 'sortFilter>metric.max': 'desc' },
              },
              aggs: {
                sortFilter: {
                  filter: {
                    bool: {
                      must: [
                        {
                          range: {
                            'PO.IssuedDate': {
                              gte: '2022',
                              lte: '2022-12-31T23:59:59Z',
                            },
                          },
                        },
                      ],
                    },
                  },
                  aggs: { metric: { stats: { field: 'PO.IssuedAmount' } } },
                },
                columns: {
                  date_histogram: {
                    field: 'PO.IssuedDate',
                    interval: 'year',
                    min_doc_count: 0,
                  },
                  aggs: {
                    'pivotMetric-stats-PO.IssuedAmount': {
                      stats: { field: 'PO.IssuedAmount' },
                    },
                  },
                },
                'pivotMetric-stats-PO.IssuedAmount': {
                  stats: { field: 'PO.IssuedAmount' },
                },
              },
            },
            columns: {
              date_histogram: {
                field: 'PO.IssuedDate',
                interval: 'year',
                min_doc_count: 0,
              },
              aggs: {
                'pivotMetric-stats-PO.IssuedAmount': {
                  stats: { field: 'PO.IssuedAmount' },
                },
              },
            },
            'pivotMetric-stats-PO.IssuedAmount': {
              stats: { field: 'PO.IssuedAmount' },
            },
          },
        },
        columns: {
          date_histogram: {
            field: 'PO.IssuedDate',
            interval: 'year',
            min_doc_count: 0,
          },
          aggs: {
            'pivotMetric-stats-PO.IssuedAmount': {
              stats: { field: 'PO.IssuedAmount' },
            },
          },
        },
        'pivotMetric-stats-PO.IssuedAmount': {
          stats: { field: 'PO.IssuedAmount' },
        },
      },
      track_total_hits: true,
    }
    let result = await buildQuery(rootPivotRequest)
    expect(result).toEqual(expected)
  })
  it('should buildQuery with multiple rows, columns, and sort on _count without valueIndex', async () => {
    let { buildQuery } = createPivotScope(
      pivotTestNode({
        values: [{ type: 'stats', field: 'PO.IssuedAmount' }],
        rows: [
          { type: 'fieldValues', field: 'Organization.State' },
          { type: 'fieldValues', field: 'Organization.NameState' },
        ],
        columns: [
          { type: 'dateInterval', field: 'PO.IssuedDate', interval: 'year' },
        ],
        sort: {
          columnValues: ['2022'],
          direction: 'desc',
        },
        expanded: { columns: true, rows: true },
      }),
      testSchemas(['Organization.NameState', 'Organization.State']),
      getStats
    )

    let expected = {
      aggs: {
        rows: {
          terms: {
            field: 'Organization.State.untouched',
            size: 10,
            order: {
              'sortFilter.doc_count': 'desc',
            },
          },
          aggs: {
            sortFilter: {
              filter: {
                bool: {
                  must: [
                    {
                      range: {
                        'PO.IssuedDate': {
                          gte: '2022',
                          lte: '2022-12-31T23:59:59Z',
                        },
                      },
                    },
                  ],
                },
              },
            },
            rows: {
              terms: {
                field: 'Organization.NameState.untouched',
                size: 10,
                order: {
                  'sortFilter.doc_count': 'desc',
                },
              },
              aggs: {
                sortFilter: {
                  filter: {
                    bool: {
                      must: [
                        {
                          range: {
                            'PO.IssuedDate': {
                              gte: '2022',
                              lte: '2022-12-31T23:59:59Z',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
                columns: {
                  date_histogram: {
                    field: 'PO.IssuedDate',
                    interval: 'year',
                    min_doc_count: 0,
                  },
                  aggs: {
                    'pivotMetric-stats-PO.IssuedAmount': {
                      stats: {
                        field: 'PO.IssuedAmount',
                      },
                    },
                  },
                },
                'pivotMetric-stats-PO.IssuedAmount': {
                  stats: {
                    field: 'PO.IssuedAmount',
                  },
                },
              },
            },
            columns: {
              date_histogram: {
                field: 'PO.IssuedDate',
                interval: 'year',
                min_doc_count: 0,
              },
              aggs: {
                'pivotMetric-stats-PO.IssuedAmount': {
                  stats: {
                    field: 'PO.IssuedAmount',
                  },
                },
              },
            },
            'pivotMetric-stats-PO.IssuedAmount': {
              stats: {
                field: 'PO.IssuedAmount',
              },
            },
          },
        },
        columns: {
          date_histogram: {
            field: 'PO.IssuedDate',
            interval: 'year',
            min_doc_count: 0,
          },
          aggs: {
            'pivotMetric-stats-PO.IssuedAmount': {
              stats: {
                field: 'PO.IssuedAmount',
              },
            },
          },
        },
        'pivotMetric-stats-PO.IssuedAmount': {
          stats: {
            field: 'PO.IssuedAmount',
          },
        },
      },
      track_total_hits: true,
    }
    let result = await buildQuery(rootPivotRequest)
    expect(result).toEqual(expected)
  })
  it('should buildQuery with nested pivot columns and subtotals', async () => {
    let { buildQuery } = createPivotScope(
      pivotTestNode({
        values: [{ type: 'sum', field: 'LineItem.TotalPrice' }],
        rows: [
          { type: 'fieldValues', field: 'Organization.State' },
          { type: 'fieldValues', field: 'Organization.NameState' },
        ],
        columns: [
          { type: 'dateInterval', field: 'PO.IssuedDate', interval: 'year' },
          { type: 'dateInterval', field: 'PO.IssuedDate', interval: 'month' },
        ],
        expanded: { columns: true, rows: true },
      }),
      testSchemas(['Organization.NameState', 'Organization.State']),
      getStats
    )

    let expected = {
      track_total_hits: true,
      aggs: {
        rows: {
          terms: { field: 'Organization.State.untouched', size: 10 },
          aggs: {
            rows: {
              terms: { field: 'Organization.NameState.untouched', size: 10 },
              aggs: {
                columns: {
                  date_histogram: {
                    field: 'PO.IssuedDate',
                    interval: 'year',
                    min_doc_count: 0,
                  },
                  aggs: {
                    columns: {
                      date_histogram: {
                        field: 'PO.IssuedDate',
                        interval: 'month',
                        min_doc_count: 0,
                      },
                      aggs: {
                        'pivotMetric-sum-LineItem.TotalPrice': {
                          sum: { field: 'LineItem.TotalPrice' },
                        },
                      },
                    },
                    'pivotMetric-sum-LineItem.TotalPrice': {
                      sum: { field: 'LineItem.TotalPrice' },
                    },
                  },
                },
                'pivotMetric-sum-LineItem.TotalPrice': {
                  sum: { field: 'LineItem.TotalPrice' },
                },
              },
            },
            columns: {
              date_histogram: {
                field: 'PO.IssuedDate',
                interval: 'year',
                min_doc_count: 0,
              },
              aggs: {
                columns: {
                  date_histogram: {
                    field: 'PO.IssuedDate',
                    interval: 'month',
                    min_doc_count: 0,
                  },
                  aggs: {
                    'pivotMetric-sum-LineItem.TotalPrice': {
                      sum: { field: 'LineItem.TotalPrice' },
                    },
                  },
                },
                'pivotMetric-sum-LineItem.TotalPrice': {
                  sum: { field: 'LineItem.TotalPrice' },
                },
              },
            },
            'pivotMetric-sum-LineItem.TotalPrice': {
              sum: { field: 'LineItem.TotalPrice' },
            },
          },
        },
        columns: {
          date_histogram: {
            field: 'PO.IssuedDate',
            interval: 'year',
            min_doc_count: 0,
          },
          aggs: {
            columns: {
              date_histogram: {
                field: 'PO.IssuedDate',
                interval: 'month',
                min_doc_count: 0,
              },
              aggs: {
                'pivotMetric-sum-LineItem.TotalPrice': {
                  sum: { field: 'LineItem.TotalPrice' },
                },
              },
            },
            'pivotMetric-sum-LineItem.TotalPrice': {
              sum: { field: 'LineItem.TotalPrice' },
            },
          },
        },
        'pivotMetric-sum-LineItem.TotalPrice': {
          sum: { field: 'LineItem.TotalPrice' },
        },
      },
    }
    let result = await buildQuery(rootPivotRequest)
    expect(result).toEqual(expected)
  })
  it('should paginateExpandedGroups for no expanded', async () => {
    let rows = [
      { type: 'fieldValues', field: 'Organization.State' },
      { type: 'fieldValues', field: 'Organization.NameState' },
    ]
    let columns = [
      { type: 'dateInterval', field: 'PO.IssuedDate', interval: 'year' },
      { type: 'dateInterval', field: 'PO.IssuedDate', interval: 'month' },
    ]
    let columnsExpantions = []
    let rowsExpansions = []

    let { getInitialRequest, getAdditionalRequests } = createPivotScope(
      pivotTestNode({
        values: [{ type: 'sum', field: 'LineItem.TotalPrice' }],
        rows,
        columns,
        expansions: [...columnsExpantions, ...rowsExpansions, rowsExpansion],
      }),
      testSchema('LineItem.TotalPrice'),
      getStats
    )

    let expectedIntial = {
      type: 'rows',
      columns: {
        drilldown: [],
        include: [],
        totals: true,
      },
      rows: {
        drilldown: ['New York'],
        skip: [],
        totals: true,
      },
    }

    expect(getInitialRequest(rowsExpansion)).toEqual(expectedIntial)

    let includeValues = [
      'New York',
      'Albany',
      'Brooklyn',
      'Long Island City',
      'Corona',
      'Buffalo',
      'Syracuse',
      'Cooperstown',
      'Rochester',
      'White Plains',
    ]
    let expectedRequests = []
    let requests = getAdditionalRequests(rowsExpansion, includeValues)
    expect(requests).toEqual(expectedRequests)
  })
  it('should paginateExpandedGroups for 2 expanded columns', async () => {
    let rows = [
      { type: 'fieldValues', field: 'Organization.State' },
      { type: 'fieldValues', field: 'Organization.NameState' },
    ]
    let columns = [
      { type: 'dateInterval', field: 'PO.IssuedDate', interval: 'year' },
      { type: 'dateInterval', field: 'PO.IssuedDate', interval: 'month' },
    ]
    let columnsExpantions = [
      {
        type: 'columns',
        drilldown: [],
        loaded: [
          '2015-01-01T00:00:00.000Z',
          '2016-01-01T00:00:00.000Z',
          '2017-01-01T00:00:00.000Z',
          '2018-01-01T00:00:00.000Z',
          '2019-01-01T00:00:00.000Z',
          '2020-01-01T00:00:00.000Z',
          '2021-01-01T00:00:00.000Z',
          '2022-01-01T00:00:00.000Z',
        ],
      },
      {
        type: 'columns',
        drilldown: ['2015-01-01T00:00:00.000Z'],
        loaded: [
          '2015-01-01T00:00:00.000Z',
          '2015-04-01T00:00:00.000Z',
          '2015-07-01T00:00:00.000Z',
          '2015-10-01T00:00:00.000Z',
        ],
      },
      {
        type: 'columns',
        drilldown: ['2016-01-01T00:00:00.000Z'],
        loaded: [
          '2016-01-01T00:00:00.000Z',
          '2016-04-01T00:00:00.000Z',
          '2016-07-01T00:00:00.000Z',
          '2016-10-01T00:00:00.000Z',
        ],
      },
    ]
    let rowsExpansions = [
      {
        type: 'rows',
        drilldown: [],
        loaded: [
          'District of Columbia',
          'California',
          'New York',
          'Virginia',
          'Texas',
          'Massachusetts',
          'Illinois',
          'New Jersey',
          'Ohio',
          'Florida',
        ],
      },
    ]

    let { getInitialRequest, getAdditionalRequests } = createPivotScope(
      pivotTestNode({
        values: [{ type: 'sum', field: 'LineItem.TotalPrice' }],
        rows,
        columns,
        expansions: [...columnsExpantions, ...rowsExpansions, rowsExpansion],
      }),
      testSchema('LineItem.TotalPrice'),
      getStats
    )

    let expectedIntial = {
      type: 'rows',
      columns: {
        drilldown: [],
        include: [
          '2015-01-01T00:00:00.000Z',
          '2016-01-01T00:00:00.000Z',
          '2017-01-01T00:00:00.000Z',
          '2018-01-01T00:00:00.000Z',
          '2019-01-01T00:00:00.000Z',
          '2020-01-01T00:00:00.000Z',
          '2021-01-01T00:00:00.000Z',
          '2022-01-01T00:00:00.000Z',
        ],
        totals: true,
      },
      rows: {
        drilldown: ['New York'],
        skip: [],
        totals: false,
      },
    }
    expect(getInitialRequest(rowsExpansion)).toEqual(expectedIntial)

    let includeValues = [
      'New York',
      'Albany',
      'Brooklyn',
      'Long Island City',
      'Corona',
      'Buffalo',
      'Syracuse',
      'Cooperstown',
      'Rochester',
      'White Plains',
    ]
    let expectedRequests = [
      {
        type: 'rows',
        columns: {
          drilldown: ['2015-01-01T00:00:00.000Z'],
          include: [
            '2015-01-01T00:00:00.000Z',
            '2015-04-01T00:00:00.000Z',
            '2015-07-01T00:00:00.000Z',
            '2015-10-01T00:00:00.000Z',
          ],
          totals: false,
        },
        rows: {
          drilldown: ['New York'],
          include: includeValues,
          totals: false,
        },
      },
      {
        type: 'rows',
        columns: {
          drilldown: ['2016-01-01T00:00:00.000Z'],
          include: [
            '2016-01-01T00:00:00.000Z',
            '2016-04-01T00:00:00.000Z',
            '2016-07-01T00:00:00.000Z',
            '2016-10-01T00:00:00.000Z',
          ],
          totals: false,
        },
        rows: {
          drilldown: ['New York'],
          include: includeValues,
          totals: false,
        },
      },
    ]
    let requests = getAdditionalRequests(rowsExpansion, includeValues)
    expect(requests).toEqual(expectedRequests)
  })
  it('should handle pivotResponse', () => {
    let aggs = pivotResponse.aggregations

    // make tiny
    aggs.rows.buckets = aggs.rows.buckets.slice(0, 2)
    aggs.rows.buckets = _.map(buck => {
      buck.rows.buckets = buck.rows.buckets.slice(0, 2)
      return buck
    }, aggs.rows.buckets)

    let { processResponse } = createPivotScope(
      pivotTestNode(),
      testSchema('Vendor.Name'),
      getStats
    )

    let nestedResult = processResponse(rootPivotRequest, pivotResponse)
    expect(stringify(nestedResult.results)).toEqual(
      stringify({
        count: 442825686,
        rows: [
          {
            key: 'Texas',
            rows: [
              {
                key: 'UT Southwestern Medical Center, Texas',
                rows: [
                  {
                    key: '0.0-500.0',
                    from: 0,
                    to: 500,
                    avg: 123.61877539749409,
                    min: 0,
                    max: 499.989990234375,
                    sum: 219405401.60811937,
                    count: 1774855,
                  },
                  {
                    key: '500.0-10000.0',
                    from: 500,
                    to: 10000,
                    avg: 1930.249843325976,
                    min: 500,
                    max: 9999.98046875,
                    sum: 894222984.4179382,
                    count: 463268,
                  },
                ],
                count: 2280465,
              },
              {
                key: 'University of Texas MD Anderson Cancer Center, Texas',
                rows: [
                  {
                    key: '0.0-500.0',
                    from: 0,
                    to: 500,
                    avg: 86.85762873285029,
                    min: 0,
                    max: 499.989990234375,
                    sum: 93114418.01862116,
                    count: 1072035,
                  },
                  {
                    key: '500.0-10000.0',
                    from: 500,
                    to: 10000,
                    avg: 1989.2294442580583,
                    min: 500,
                    max: 9998.7998046875,
                    sum: 364042912.9053345,
                    count: 183007,
                  },
                ],
                count: 1272132,
              },
            ],
            count: 85720456,
          },
          {
            key: 'Ohio',
            rows: [
              {
                key: 'Ohio State University, Ohio',
                rows: [
                  {
                    key: '0.0-500.0',
                    from: 0,
                    to: 500,
                    avg: 96.12894216963802,
                    min: 0,
                    max: 499.989990234375,
                    sum: 386852567.13375384,
                    count: 4024309,
                  },
                  {
                    key: '500.0-10000.0',
                    from: 500,
                    to: 10000,
                    avg: 1802.1472297222226,
                    min: 500,
                    max: 9999.990234375,
                    sum: 1161215369.618744,
                    count: 644351,
                  },
                ],
                count: 4952263,
              },
              {
                key: 'Greene County Court of Commons Pleas, Ohio',
                rows: [
                  {
                    key: '0.0-500.0',
                    from: 0,
                    to: 500,
                    avg: 101.28828428425045,
                    min: 0,
                    max: 499.989990234375,
                    sum: 87544071.83658338,
                    count: 864306,
                  },
                  {
                    key: '500.0-10000.0',
                    from: 500,
                    to: 10000,
                    avg: 1426.013434972438,
                    min: 500,
                    max: 9998,
                    sum: 256274578.45263672,
                    count: 179714,
                  },
                ],
                count: 1078624,
              },
            ],
            count: 69508750,
          },
        ],
      })
    )
  })
  it('should handle pivotResponse with filtered fieldValueRow', () => {
    let { processResponse } = createPivotScope(
      pivotTestNode({
        values: [{ field: 'PO.IssuedAmount', type: 'avg' }],
        rows: [
          {
            field: 'Organization.NameState',
            type: 'fieldValues',
            filter: 'Okeechobee',
          },
          { field: 'PO.IssuedDate', type: 'dateInterval', interval: 'year' },
        ],
      }),
      testSchema('Vendor.Name'),
      getStats
    )
    let nestedResult = processResponse(
      rootPivotRequest,
      pivotRepsonseWithFilteredFieldValueGroup
    )
    expect(stringify(nestedResult.results)).toEqual(
      stringify({
        count: 574247,
        rows: [
          {
            key: 'Okeechobee County Schools, Florida',
            count: 552831,
            rows: [
              {
                keyAsString: '2015-01-01T00:00:00.000Z',
                key: 1420070400000,
                count: 149661,
                'avg-PO.IssuedAmount': 20844.647948233425,
              },
              {
                keyAsString: '2016-01-01T00:00:00.000Z',
                key: 1451606400000,
                count: 161271,
                'avg-PO.IssuedAmount': 21172.11132216827,
              },
              {
                keyAsString: '2017-01-01T00:00:00.000Z',
                key: 1483228800000,
                count: 195607,
                'avg-PO.IssuedAmount': 21265.707126306814,
              },
              {
                keyAsString: '2018-01-01T00:00:00.000Z',
                key: 1514764800000,
                count: 26707,
                'avg-PO.IssuedAmount': 23561.699367492976,
              },
              {
                keyAsString: '2019-01-01T00:00:00.000Z',
                key: 1546300800000,
                count: 7118,
                'avg-PO.IssuedAmount': 6285.349479416158,
              },
              {
                keyAsString: '2020-01-01T00:00:00.000Z',
                key: 1577836800000,
                count: 6901,
                'avg-PO.IssuedAmount': 9253.239317711703,
              },
              {
                keyAsString: '2021-01-01T00:00:00.000Z',
                key: 1609459200000,
                count: 5566,
                'avg-PO.IssuedAmount': 8548.494813621837,
              },
            ],
          },
          {
            key: "Okeechobee County Sheriff's Office, Florida",
            count: 11984,
            rows: [
              {
                keyAsString: '2015-01-01T00:00:00.000Z',
                key: 1420070400000,
                count: 1719,
                'avg-PO.IssuedAmount': 2244.3115442241606,
              },
              {
                keyAsString: '2016-01-01T00:00:00.000Z',
                key: 1451606400000,
                count: 1648,
                'avg-PO.IssuedAmount': 2572.4247905976563,
              },
              {
                keyAsString: '2017-01-01T00:00:00.000Z',
                key: 1483228800000,
                count: 1772,
                'avg-PO.IssuedAmount': 1848.8124668818834,
              },
              {
                keyAsString: '2018-01-01T00:00:00.000Z',
                key: 1514764800000,
                count: 1668,
                'avg-PO.IssuedAmount': 2929.421505508663,
              },
              {
                keyAsString: '2019-01-01T00:00:00.000Z',
                key: 1546300800000,
                count: 1765,
                'avg-PO.IssuedAmount': 2365.297106342478,
              },
              {
                keyAsString: '2020-01-01T00:00:00.000Z',
                key: 1577836800000,
                count: 2270,
                'avg-PO.IssuedAmount': 2458.5539745973597,
              },
              {
                keyAsString: '2021-01-01T00:00:00.000Z',
                key: 1609459200000,
                count: 1142,
                'avg-PO.IssuedAmount': 2940.05088930915,
              },
            ],
          },
          {
            key: 'Okeechobee County Board of County Commissioners, Florida',
            count: 5100,
            rows: [
              {
                keyAsString: '2018-01-01T00:00:00.000Z',
                key: 1514764800000,
                count: 1673,
                'avg-PO.IssuedAmount': 102648.52495089962,
              },
              {
                keyAsString: '2019-01-01T00:00:00.000Z',
                key: 1546300800000,
                count: 1531,
                'avg-PO.IssuedAmount': 107292.1159183937,
              },
              {
                keyAsString: '2020-01-01T00:00:00.000Z',
                key: 1577836800000,
                count: 1406,
                'avg-PO.IssuedAmount': 141619.58640305314,
              },
              {
                keyAsString: '2021-01-01T00:00:00.000Z',
                key: 1609459200000,
                count: 490,
                'avg-PO.IssuedAmount': 19925.228112987596,
              },
            ],
          },
          {
            key: 'Okeechobee Soil And Water Conservation District, Florida',
            count: 2983,
            rows: [
              {
                keyAsString: '2015-01-01T00:00:00.000Z',
                key: 1420070400000,
                count: 193,
                'avg-PO.IssuedAmount': 849.2400590403605,
              },
              {
                keyAsString: '2016-01-01T00:00:00.000Z',
                key: 1451606400000,
                count: 370,
                'avg-PO.IssuedAmount': 792.2180872080756,
              },
              {
                keyAsString: '2017-01-01T00:00:00.000Z',
                key: 1483228800000,
                count: 229,
                'avg-PO.IssuedAmount': 546.3209660218058,
              },
              {
                keyAsString: '2018-01-01T00:00:00.000Z',
                key: 1514764800000,
                count: 225,
                'avg-PO.IssuedAmount': 688.5280880631341,
              },
              {
                keyAsString: '2019-01-01T00:00:00.000Z',
                key: 1546300800000,
                count: 580,
                'avg-PO.IssuedAmount': 1278.2532585058361,
              },
              {
                keyAsString: '2020-01-01T00:00:00.000Z',
                key: 1577836800000,
                count: 618,
                'avg-PO.IssuedAmount': 1016.9871758723656,
              },
              {
                keyAsString: '2021-01-01T00:00:00.000Z',
                key: 1609459200000,
                count: 768,
                'avg-PO.IssuedAmount': 1594.242624501135,
              },
            ],
          },
          {
            key: 'Okeechobee County Clerk of the Circuit Court, Florida',
            count: 1349,
            rows: [
              {
                keyAsString: '2015-01-01T00:00:00.000Z',
                key: 1420070400000,
                count: 161,
                'avg-PO.IssuedAmount': 1252.3234916582498,
              },
              {
                keyAsString: '2016-01-01T00:00:00.000Z',
                key: 1451606400000,
                count: 239,
                'avg-PO.IssuedAmount': 2217.290081339297,
              },
              {
                keyAsString: '2017-01-01T00:00:00.000Z',
                key: 1483228800000,
                count: 276,
                'avg-PO.IssuedAmount': 2114.950146716574,
              },
              {
                keyAsString: '2018-01-01T00:00:00.000Z',
                key: 1514764800000,
                count: 247,
                'avg-PO.IssuedAmount': 2059.0517405768637,
              },
              {
                keyAsString: '2019-01-01T00:00:00.000Z',
                key: 1546300800000,
                count: 217,
                'avg-PO.IssuedAmount': 2070.5967847586776,
              },
              {
                keyAsString: '2020-01-01T00:00:00.000Z',
                key: 1577836800000,
                count: 113,
                'avg-PO.IssuedAmount': 1614.6408893956548,
              },
              {
                keyAsString: '2021-01-01T00:00:00.000Z',
                key: 1609459200000,
                count: 96,
                'avg-PO.IssuedAmount': 981.880828499794,
              },
            ],
          },
        ],
      })
    )
  })
  it('should processResponse correctly for pivots with columns', () => {
    let { processResponse } = createPivotScope(
      pivotTestNode(),
      testSchema('Vendor.Name'),
      getStats
    )
    let nestedResult = processResponse(rootPivotRequest, columnResponse)
    expect(stringify(nestedResult.results)).toEqual(stringify(columnResult))
  })
  it('should filter', async () => {
    let input = {
      key: 'test',
      type: 'pivot',
      values: [{ type: 'stats', field: 'PO.IssuedAmount' }],
      rows: [
        { type: 'fieldValues', field: 'Organization.State' },
        { type: 'fieldValues', field: 'Organization.City' },
      ],
      columns: [
        { type: 'dateInterval', field: 'PO.IssuedDate', interval: 'year' },
      ],
      sort: {
        columnValues: ['2022'],
        direction: 'desc',
      },
      filters: [
        { rows: ['Nevada', 'Reno'], columns: ['2017'] },
        { rows: ['Florida', 'Hillsboro Beach'] },
      ],
    }
    let expected = {
      bool: {
        minimum_should_match: 1,
        should: [
          {
            bool: {
              must: [
                { term: { 'Organization.State.untouched': 'Nevada' } },
                { term: { 'Organization.City.untouched': 'Reno' } },
                {
                  range: {
                    'PO.IssuedDate': {
                      gte: '2017',
                      lte: '2017-12-31T23:59:59Z',
                    },
                  },
                },
              ],
            },
          },
          {
            bool: {
              must: [
                { term: { 'Organization.State.untouched': 'Florida' } },
                { term: { 'Organization.City.untouched': 'Hillsboro Beach' } },
              ],
            },
          },
        ],
      },
    }
    let result = await filter(
      input,
      testSchemas(['Organization.City', 'Organization.State'])
    )
    expect(result).toEqual(expected)
  })
})
