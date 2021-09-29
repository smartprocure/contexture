let {
  buildQuery,
  aggsForValues,
  processResponse,
} = require('../../../src/example-types/metricGroups/pivot')
let { expect } = require('chai')
let { testSchema, testSchemas } = require('../testUtils')
let pivotResponse = require('./pivotResponse')
let _ = require('lodash/fp')
let F = require('futil')

// pass aggsForValues in each stage
describe('pivot', () => {
  it('aggsForValues', () => {
    let values = [
      { type: 'min', field: 'LineItem.TotalPrice' },
      { type: 'max', field: 'LineItem.TotalPrice' },
      { type: 'avg', field: 'LineItem.TotalPrice' },
      { type: 'sum', field: 'LineItem.TotalPrice' },
    ]
    expect(aggsForValues(values)).to.deep.equal({
      'pivotMetric-min-LineItem.TotalPrice': { min: { field: 'LineItem.TotalPrice' } },
      'pivotMetric-max-LineItem.TotalPrice': { max: { field: 'LineItem.TotalPrice' } },
      'pivotMetric-avg-LineItem.TotalPrice': { avg: { field: 'LineItem.TotalPrice' } },
      'pivotMetric-sum-LineItem.TotalPrice': { sum: { field: 'LineItem.TotalPrice' } },
    })
  })
  it('aggsForValues with not analyzed field form schemas', () => {
    let values = [{ type: 'cardinality', field: 'Vendor.Name' }]
    expect(aggsForValues(values, testSchema('Vendor.Name'))).to.deep.equal({
      'pivotMetric-cardinality-Vendor.Name': {
        cardinality: { field: 'Vendor.Name.untouched' },
      },
    })
  })
  it('should buildQuery', async () => {
    // ES -> PVT
    // buckets -> groups (rows/columns)
    // metrics -> values
    let input = {
      key: 'test',
      type: 'pivot',
      values: [
        // labels are `${_.startCase(type)} of ${schemaLabel(field)}`
        // key - defaults to `${type}-${field}`
        //    unless type has a special override? e.g. if doesnt take field, like top_hits
        { type: 'min', field: 'LineItem.TotalPrice' },
        { type: 'max', field: 'LineItem.TotalPrice' },
        { type: 'avg', field: 'LineItem.TotalPrice' },
        { type: 'sum', field: 'LineItem.TotalPrice' },
        { type: 'percentiles', field: 'LineItem.TotalPrice', percents: [20, 50] },
        { type: 'cardinality', field: 'Vendor.Name' },
        { type: 'topHits' },
      ],
      groups: [
        { type: 'fieldValues', field: 'Organization.NameState' },
        { type: 'dateInterval', field: 'PO.IssuedDate', interval: 'month' },
      ],
    }
    let expected = {
      aggs: {
        groups: {
          terms: {
            field: 'Organization.NameState.untouched',
            size: 10,
            // order: {}
          },
          aggs: {
            groups: {
              date_histogram: {
                field: 'PO.IssuedDate',
                interval: 'month',
                min_doc_count: 0,
              },
              aggs: {
                'pivotMetric-min-LineItem.TotalPrice': {
                  min: { field: 'LineItem.TotalPrice' }
                },
                'pivotMetric-max-LineItem.TotalPrice': {
                  max: { field: 'LineItem.TotalPrice' }
                },
                'pivotMetric-avg-LineItem.TotalPrice': {
                  avg: { field: 'LineItem.TotalPrice' }
                },
                'pivotMetric-sum-LineItem.TotalPrice': {
                  sum: { field: 'LineItem.TotalPrice' }
                },
                'pivotMetric-percentiles-LineItem.TotalPrice': {
                  percentiles: {
                    field: 'LineItem.TotalPrice',
                    percents: [20, 50]
                  }
                },
                'pivotMetric-cardinality-Vendor.Name': {
                  // shoul be untouched??
                  cardinality: { field: 'Vendor.Name.untouched' }
                },
                'pivotMetric-topHits': { top_hits: {} },
              },
            }
          },

        },
      },
    }
    let result = await buildQuery(
      input,
      testSchemas(['Organization.NameState', 'Vendor.Name']),
      () => { }, // getStats(search) -> stats(field, statsArray)
    )
    expect(result).to.eql(expected)
  })
  it('should buildQuery with stats/statsField', async () => {
    let input = {
      key: 'test',
      type: 'pivot',
      statsField: 'LineItem.TotalPrice',
      stats: ['min', 'max', 'avg', 'sum'],
      groups: [
        {
          type: 'fieldValues',
          field: 'Organization.NameState',
        },
        {
          type: 'dateInterval',
          field: 'PO.IssuedDate',
          interval: 'month',
        },
      ],
    }
    let expected = {
      aggs: {
        groups: {
          terms: {
            field: 'Organization.NameState.untouched',
            size: 10,
            // order: {}
          },
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
            }
          },
          
        },
      },
    }
    let result = await buildQuery(
      input,
      testSchema('Organization.NameState'),
      () => {}, // getStats(search) -> stats(field, statsArray)
    )
    expect(result).to.eql(expected)
  })
  it('should buildQuery for fieldValuePartition', async () => {
    let input = {
      key: 'test',
      type: 'pivot',
      values: [{ type: 'sum', field: 'LineItem.TotalPrice' }],
      groups: [
        {
          type: 'fieldValuePartition',
          field: 'Vendor.City',
          matchValue: 'Washington',
        },
      ],
    }
    let expected = {
      aggs: {
        groups: {
          filters: {
            other_bucket_key: 'fail',
            filters: {
              pass: { term: { 'Vendor.City.untouched': 'Washington' } },
            },
          },
          aggs: {
            'pivotMetric-sum-LineItem.TotalPrice': {
              sum: { field: 'LineItem.TotalPrice' }
            },
          },
        },
      },
    }
    let result = await buildQuery(
      input,
      testSchemas(['Vendor.City']),
      () => { }, // getStats(search) -> stats(field, statsArray)
    )
    expect(result).to.eql(expected)
  })
  it('should buildQuery with subtotals', async () => {
    // ES -> PVT
    // buckets -> groups (rows/columns)
    // metrics -> values
    let input = {
      key: 'test',
      type: 'pivot',
      subtotals: true,
      values: [
        { type: 'min', field: 'LineItem.TotalPrice' },
        { type: 'max', field: 'LineItem.TotalPrice' },
        { type: 'avg', field: 'LineItem.TotalPrice' },
        { type: 'sum', field: 'LineItem.TotalPrice' },
      ],
      groups: [
        { type: 'fieldValues', field: 'Organization.NameState' },
        { type: 'dateInterval', field: 'PO.IssuedDate', interval: 'month' },
      ],
    }
    let expected = {
      aggs: {
        groups: {
          terms: {
            field: 'Organization.NameState.untouched',
            size: 10,
            // order: {}
          },
          aggs: {
            'pivotMetric-min-LineItem.TotalPrice': {
              min: { field: 'LineItem.TotalPrice' }
            },
            'pivotMetric-max-LineItem.TotalPrice': {
              max: { field: 'LineItem.TotalPrice' }
            },
            'pivotMetric-avg-LineItem.TotalPrice': {
              avg: { field: 'LineItem.TotalPrice' }
            },
            'pivotMetric-sum-LineItem.TotalPrice': {
              sum: { field: 'LineItem.TotalPrice' }
            },
            groups: {
              date_histogram: {
                field: 'PO.IssuedDate',
                interval: 'month',
                min_doc_count: 0,
              },
              aggs: {
                'pivotMetric-min-LineItem.TotalPrice': {
                  min: { field: 'LineItem.TotalPrice' }
                },
                'pivotMetric-max-LineItem.TotalPrice': {
                  max: { field: 'LineItem.TotalPrice' }
                },
                'pivotMetric-avg-LineItem.TotalPrice': {
                  avg: { field: 'LineItem.TotalPrice' }
                },
                'pivotMetric-sum-LineItem.TotalPrice': {
                  sum: { field: 'LineItem.TotalPrice' }
                },
              },
            }
          },

        },
      },
    }
    let result = await buildQuery(
      input,
      testSchema('Organization.NameState'),
      () => { }, // getStats(search) -> stats(field, statsArray)
    )
    expect(result).to.eql(expected)
  })
  it('should buildQuery with more types', async () => {
    let input = {
      key: 'test',
      type: 'pivot',
      values: [
        { type: 'min', field: 'LineItem.TotalPrice' },
        { type: 'max', field: 'LineItem.TotalPrice' },
        { type: 'avg', field: 'LineItem.TotalPrice' },
        { type: 'sum', field: 'LineItem.TotalPrice' },
      ],
      groups: [
        { type: 'fieldValues', field: 'Organization.State' },
        { type: 'fieldValues', field: 'Organization.NameState' },
        {
          type: 'numberRanges',
          field: 'LineItem.TotalPrice',
          ranges: [
            { from: '0', to: '500' },
            { from: '500', to: '10000' },
          ]
        },
      ],
    }
    let expected = {
      aggs: {
        groups: {
          terms: {
            field: 'Organization.State.untouched',
            size: 10,
            // order: {}
          },
          aggs: {
            groups: {
              terms: {
                field: 'Organization.NameState.untouched',
                size: 10,
                // order: {}
              },
              aggs: {
                groups: {
                  range: {
                    field: 'LineItem.TotalPrice',
                    ranges: [
                      { from: '0', to: '500' },
                      { from: '500', to: '10000' },
                    ],
                  },
                  aggs: {
                    'pivotMetric-min-LineItem.TotalPrice': {
                      min: { field: 'LineItem.TotalPrice' }
                    },
                    'pivotMetric-max-LineItem.TotalPrice': {
                      max: { field: 'LineItem.TotalPrice' }
                    },
                    'pivotMetric-avg-LineItem.TotalPrice': {
                      avg: { field: 'LineItem.TotalPrice' }
                    },
                    'pivotMetric-sum-LineItem.TotalPrice': {
                      sum: { field: 'LineItem.TotalPrice' }
                    },
                  },
                }
              },
            },
          }
        }
      },
    }
    let result = await buildQuery(
      input,
      testSchemas(['Organization.NameState', 'Organization.State']),
      () => { }, // getStats(search) -> stats(field, statsArray)
    )
    expect(result).to.eql(expected)
  })
  it('should handle pivotResponse', () => {
    let aggs = pivotResponse.aggregations

    // make tiny
    aggs.groups.buckets = aggs.groups.buckets.slice(0, 2)
    aggs.groups.buckets = _.map(
      buck => {
        buck.groups.buckets = buck.groups.buckets.slice(0, 2)
        return buck
      },
      aggs.groups.buckets
    )

    let flatResult = processResponse(pivotResponse, {flatten: true})
    expect(flatResult.results).to.eql([
      {
        key: '0.0-500.0',
        from: 0,
        to: 500,
        count: 1774855,
        avg: 123.61877539749409,
        min: 0,
        max: 499.989990234375,
        sum: 219405401.60811937,
        group0: 'Texas',
        group1: 'UT Southwestern Medical Center, Texas',
        group2: '0.0-500.0'
      },
      {
        key: '500.0-10000.0',
        from: 500,
        to: 10000,
        count: 463268,
        avg: 1930.249843325976,
        min: 500,
        max: 9999.98046875,
        sum: 894222984.4179382,
        group0: 'Texas',
        group1: 'UT Southwestern Medical Center, Texas',
        group2: '500.0-10000.0'
      },
      {
        key: '0.0-500.0',
        from: 0,
        to: 500,
        count: 1072035,
        avg: 86.85762873285029,
        min: 0,
        max: 499.989990234375,
        sum: 93114418.01862116,
        group0: 'Texas',
        group1: 'University of Texas MD Anderson Cancer Center, Texas',
        group2: '0.0-500.0'
      },
      {
        key: '500.0-10000.0',
        from: 500,
        to: 10000,
        count: 183007,
        avg: 1989.2294442580583,
        min: 500,
        max: 9998.7998046875,
        sum: 364042912.9053345,
        group0: 'Texas',
        group1: 'University of Texas MD Anderson Cancer Center, Texas',
        group2: '500.0-10000.0'
      },
      {
        key: '0.0-500.0',
        from: 0,
        to: 500,
        count: 4024309,
        avg: 96.12894216963802,
        min: 0,
        max: 499.989990234375,
        sum: 386852567.13375384,
        group0: 'Ohio',
        group1: 'Ohio State University, Ohio',
        group2: '0.0-500.0'
      },
      {
        key: '500.0-10000.0',
        from: 500,
        to: 10000,
        count: 644351,
        avg: 1802.1472297222226,
        min: 500,
        max: 9999.990234375,
        sum: 1161215369.618744,
        group0: 'Ohio',
        group1: 'Ohio State University, Ohio',
        group2: '500.0-10000.0'
      },
      {
        key: '0.0-500.0',
        from: 0,
        to: 500,
        count: 864306,
        avg: 101.28828428425045,
        min: 0,
        max: 499.989990234375,
        sum: 87544071.83658338,
        group0: 'Ohio',
        group1: 'Greene County Court of Commons Pleas, Ohio',
        group2: '0.0-500.0'
      },
      {
        key: '500.0-10000.0',
        from: 500,
        to: 10000,
        count: 179714,
        avg: 1426.013434972438,
        min: 500,
        max: 9998,
        sum: 256274578.45263672,
        group0: 'Ohio',
        group1: 'Greene County Court of Commons Pleas, Ohio',
        group2: '500.0-10000.0'
      }
    ])

    let nestedResult = processResponse(pivotResponse)
    expect(nestedResult.results).to.eql([
      {
        key: 'Texas',
        groups: [
          {
            key: 'UT Southwestern Medical Center, Texas',
            groups: [
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
            groups: [
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
        groups: [
          {
            key: 'Ohio State University, Ohio',
            groups: [
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
            groups: [
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
    ])
  })
})
