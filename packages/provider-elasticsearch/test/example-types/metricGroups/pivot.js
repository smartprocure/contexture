let _ = require('lodash/fp')
let {
  buildQuery,
  aggsForValues,
  processResponse,
} = require('../../../src/example-types/metricGroups/pivot')
let { expect } = require('chai')
let { testSchema, testSchemas } = require('../testUtils')
let pivotResponse = require('./pivotResponse')
let pivotRepsonseWithFilteredFieldValueGroup = require('./pivotRepsonseWithFilteredFieldValueGroup')

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
        {
          type: 'percentiles',
          field: 'LineItem.TotalPrice',
          percents: [20, 50],
        },
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
                    field: 'LineItem.TotalPrice',
                    percents: [20, 50],
                  },
                },
                'pivotMetric-cardinality-Vendor.Name': {
                  // shoul be untouched??
                  cardinality: { field: 'Vendor.Name.untouched' },
                },
                'pivotMetric-topHits': { top_hits: {} },
              },
            },
          },
        },
      },
    }
    let result = await buildQuery(
      input,
      testSchemas(['Organization.NameState', 'Vendor.Name']),
      () => {} // getStats(search) -> stats(field, statsArray)
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
              sum: { field: 'LineItem.TotalPrice' },
            },
          },
        },
      },
    }
    let result = await buildQuery(
      input,
      testSchemas(['Vendor.City']),
      () => {} // getStats(search) -> stats(field, statsArray)
    )
    expect(result).to.eql(expected)
  })
  it('should buildQuery for fieldValues', async () => {
    let input = {
      key: 'test',
      type: 'pivot',
      values: [{ type: 'sum', field: 'LineItem.TotalPrice' }],
      groups: [
        {
          type: 'fieldValues',
          field: 'Organization.Name',
          filter: 'city',
        },
      ],
    }
    let expected = {
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
            groups: {
              terms: {
                field: 'Organization.Name',
                size: 10,

                // *********
                // NOTE: Order is complicated and might not work with terms aggs
                // https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-terms-aggregation.html#search-aggregations-bucket-terms-aggregation-order
                // *********

                // TODO; for order, consider passing ing
                //  pivotMetric-sum-LineItem.TotalPrice
                // OR, some kind of field building thing that's aware of field and tpye
                    // eg/ sort: {field, metric, order}
                    // sort: {total price, sum, desc}
                // order: { 'sum.value': 'desc' },
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
    }
    let result = await buildQuery(
      input,
      testSchemas(['Vendor.City']),
      () => {} // getStats(search) -> stats(field, statsArray)
    )
    expect(result).to.eql(expected)
  })
  it('should buildQuery for fieldValues with drilldown', async () => {
    // TODO: add tests for dateInterval, numberInterval, fieldValuePartition
    // TODO: test keyForGroup (e.g. month for date interval)
    let input = {
      key: 'test',
      type: 'pivot',
      values: [{ type: 'sum', field: 'LineItem.TotalPrice' }],
      groups: [
        {
          type: 'fieldValues',
          field: 'Organization.Name',
          drilldown: 'Reno'
        },
        {
          type: 'numberRanges',
          field: 'LineItem.TotalPrice',
          ranges: [
            { from: '0', to: '500' },
            { from: '500', to: '10000' },
          ],
          drilldown: '0.0-500.0'
        },
      ],
    }
    let expected = {
      aggs: {
        pivotFilter: {
          filter: {
            bool: {
              must: [
                { term: { 'Organization.Name': 'Reno' } },
                {
                  range: {
                    'LineItem.TotalPrice': { gte: '0.0', lte: '500.0' }
                  }
                }
              ],
            },
          },
          aggs: {
            groups: {
              terms: { field: 'Organization.Name', size: 10 },
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
                    'pivotMetric-sum-LineItem.TotalPrice': {
                      sum: { field: 'LineItem.TotalPrice' },
                    },
                  }
                }
              },
            },
          },
        },
      },
    }
    let result = await buildQuery(
      input,
      testSchemas(['Vendor.City']),
      () => {} // getStats(search) -> stats(field, statsArray)
    )
    expect(result).to.eql(expected)
  })
  it('should buildQuery for smart numberInterval to show getStats works', async () => {
    let input = {
      key: 'test',
      type: 'pivot',
      values: [{ type: 'sum', field: 'LineItem.TotalPrice' }],
      groups: [
        {
          type: 'numberInterval',
          field: 'LineItem.UnitPrice',
          interval: 'smart',
        },
      ],
    }
    let expected = {
      aggs: {
        groups: {
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
      },
    }
    let result = await buildQuery(
      input,
      testSchemas(['Vendor.City']),
      // get stats hard coded here
      () => ({ min: 10, max: 500 })
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
            groups: {
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
          },
        },
      },
    }
    let result = await buildQuery(
      input,
      testSchema('Organization.NameState'),
      () => {} // getStats(search) -> stats(field, statsArray)
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
          ],
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
              },
            },
          },
        },
      },
    }
    let result = await buildQuery(
      input,
      testSchemas(['Organization.NameState', 'Organization.State']),
      () => {} // getStats(search) -> stats(field, statsArray)
    )
    expect(result).to.eql(expected)
  })
  it('should handle pivotResponse', () => {
    let aggs = pivotResponse.aggregations

    // make tiny
    aggs.groups.buckets = aggs.groups.buckets.slice(0, 2)
    aggs.groups.buckets = _.map(buck => {
      buck.groups.buckets = buck.groups.buckets.slice(0, 2)
      return buck
    }, aggs.groups.buckets)

    let flatResult = processResponse(pivotResponse, { 
      groups: [
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
      flatten: true
    })
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
        group2: '0.0-500.0',
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
        group2: '500.0-10000.0',
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
        group2: '0.0-500.0',
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
        group2: '500.0-10000.0',
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
        group2: '0.0-500.0',
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
        group2: '500.0-10000.0',
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
        group2: '0.0-500.0',
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
        group2: '500.0-10000.0',
      },
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
  it('should handle pivotResponse with filtered fieldValueGroup', () => {
    let nestedResult = processResponse(
      pivotRepsonseWithFilteredFieldValueGroup,
      {
        values: [{ field: 'PO.IssuedAmount', type: 'avg' }],
        groups: [
          {
            field: 'Organization.NameState',
            type: 'fieldValues',
            filter: 'Okeechobee',
          },
          { field: 'PO.IssuedDate', type: 'dateInterval', interval: 'year' },
        ],
      }
    )
    expect(nestedResult.results).to.eql([
      {
        key: 'Okeechobee County Schools, Florida',
        count: 552831,
        groups: [
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
        groups: [
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
        groups: [
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
        groups: [
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
        groups: [
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
    ])
  })
})
