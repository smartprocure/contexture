export default {
  took: 29,
  timed_out: false,
  _shards: {
    total: 80,
    successful: 80,
    skipped: 0,
    failed: 0,
  },
  hits: {
    total: {
      value: 574248,
      relation: 'gte',
    },
    max_score: null,
    hits: [],
  },
  aggregations: {
    valueFilter: {
      doc_count: 574247,
      rows: {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [
          {
            key: 'Okeechobee County Schools, Florida',
            doc_count: 552831,
            rows: {
              buckets: [
                {
                  key_as_string: '2015-01-01T00:00:00.000Z',
                  key: 1420070400000,
                  doc_count: 149661,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 20844.647948233425,
                  },
                },
                {
                  key_as_string: '2016-01-01T00:00:00.000Z',
                  key: 1451606400000,
                  doc_count: 161271,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 21172.11132216827,
                  },
                },
                {
                  key_as_string: '2017-01-01T00:00:00.000Z',
                  key: 1483228800000,
                  doc_count: 195607,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 21265.707126306814,
                  },
                },
                {
                  key_as_string: '2018-01-01T00:00:00.000Z',
                  key: 1514764800000,
                  doc_count: 26707,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 23561.699367492976,
                  },
                },
                {
                  key_as_string: '2019-01-01T00:00:00.000Z',
                  key: 1546300800000,
                  doc_count: 7118,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 6285.349479416158,
                  },
                },
                {
                  key_as_string: '2020-01-01T00:00:00.000Z',
                  key: 1577836800000,
                  doc_count: 6901,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 9253.239317711703,
                  },
                },
                {
                  key_as_string: '2021-01-01T00:00:00.000Z',
                  key: 1609459200000,
                  doc_count: 5566,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 8548.494813621837,
                  },
                },
              ],
            },
          },
          {
            key: "Okeechobee County Sheriff's Office, Florida",
            doc_count: 11984,
            rows: {
              buckets: [
                {
                  key_as_string: '2015-01-01T00:00:00.000Z',
                  key: 1420070400000,
                  doc_count: 1719,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 2244.3115442241606,
                  },
                },
                {
                  key_as_string: '2016-01-01T00:00:00.000Z',
                  key: 1451606400000,
                  doc_count: 1648,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 2572.4247905976563,
                  },
                },
                {
                  key_as_string: '2017-01-01T00:00:00.000Z',
                  key: 1483228800000,
                  doc_count: 1772,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 1848.8124668818834,
                  },
                },
                {
                  key_as_string: '2018-01-01T00:00:00.000Z',
                  key: 1514764800000,
                  doc_count: 1668,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 2929.421505508663,
                  },
                },
                {
                  key_as_string: '2019-01-01T00:00:00.000Z',
                  key: 1546300800000,
                  doc_count: 1765,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 2365.297106342478,
                  },
                },
                {
                  key_as_string: '2020-01-01T00:00:00.000Z',
                  key: 1577836800000,
                  doc_count: 2270,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 2458.5539745973597,
                  },
                },
                {
                  key_as_string: '2021-01-01T00:00:00.000Z',
                  key: 1609459200000,
                  doc_count: 1142,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 2940.05088930915,
                  },
                },
              ],
            },
          },
          {
            key: 'Okeechobee County Board of County Commissioners, Florida',
            doc_count: 5100,
            rows: {
              buckets: [
                {
                  key_as_string: '2018-01-01T00:00:00.000Z',
                  key: 1514764800000,
                  doc_count: 1673,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 102648.52495089962,
                  },
                },
                {
                  key_as_string: '2019-01-01T00:00:00.000Z',
                  key: 1546300800000,
                  doc_count: 1531,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 107292.1159183937,
                  },
                },
                {
                  key_as_string: '2020-01-01T00:00:00.000Z',
                  key: 1577836800000,
                  doc_count: 1406,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 141619.58640305314,
                  },
                },
                {
                  key_as_string: '2021-01-01T00:00:00.000Z',
                  key: 1609459200000,
                  doc_count: 490,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 19925.228112987596,
                  },
                },
              ],
            },
          },
          {
            key: 'Okeechobee Soil And Water Conservation District, Florida',
            doc_count: 2983,
            rows: {
              buckets: [
                {
                  key_as_string: '2015-01-01T00:00:00.000Z',
                  key: 1420070400000,
                  doc_count: 193,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 849.2400590403605,
                  },
                },
                {
                  key_as_string: '2016-01-01T00:00:00.000Z',
                  key: 1451606400000,
                  doc_count: 370,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 792.2180872080756,
                  },
                },
                {
                  key_as_string: '2017-01-01T00:00:00.000Z',
                  key: 1483228800000,
                  doc_count: 229,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 546.3209660218058,
                  },
                },
                {
                  key_as_string: '2018-01-01T00:00:00.000Z',
                  key: 1514764800000,
                  doc_count: 225,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 688.5280880631341,
                  },
                },
                {
                  key_as_string: '2019-01-01T00:00:00.000Z',
                  key: 1546300800000,
                  doc_count: 580,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 1278.2532585058361,
                  },
                },
                {
                  key_as_string: '2020-01-01T00:00:00.000Z',
                  key: 1577836800000,
                  doc_count: 618,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 1016.9871758723656,
                  },
                },
                {
                  key_as_string: '2021-01-01T00:00:00.000Z',
                  key: 1609459200000,
                  doc_count: 768,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 1594.242624501135,
                  },
                },
              ],
            },
          },
          {
            key: 'Okeechobee County Clerk of the Circuit Court, Florida',
            doc_count: 1349,
            rows: {
              buckets: [
                {
                  key_as_string: '2015-01-01T00:00:00.000Z',
                  key: 1420070400000,
                  doc_count: 161,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 1252.3234916582498,
                  },
                },
                {
                  key_as_string: '2016-01-01T00:00:00.000Z',
                  key: 1451606400000,
                  doc_count: 239,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 2217.290081339297,
                  },
                },
                {
                  key_as_string: '2017-01-01T00:00:00.000Z',
                  key: 1483228800000,
                  doc_count: 276,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 2114.950146716574,
                  },
                },
                {
                  key_as_string: '2018-01-01T00:00:00.000Z',
                  key: 1514764800000,
                  doc_count: 247,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 2059.0517405768637,
                  },
                },
                {
                  key_as_string: '2019-01-01T00:00:00.000Z',
                  key: 1546300800000,
                  doc_count: 217,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 2070.5967847586776,
                  },
                },
                {
                  key_as_string: '2020-01-01T00:00:00.000Z',
                  key: 1577836800000,
                  doc_count: 113,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 1614.6408893956548,
                  },
                },
                {
                  key_as_string: '2021-01-01T00:00:00.000Z',
                  key: 1609459200000,
                  doc_count: 96,
                  'pivotMetric-avg-PO.IssuedAmount': {
                    value: 981.880828499794,
                  },
                },
              ],
            },
          },
        ],
      },
    },
  },
}
