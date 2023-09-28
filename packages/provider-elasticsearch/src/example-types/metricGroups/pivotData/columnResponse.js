export default {
  took: 1188,
  timed_out: false,
  _shards: {
    total: 80,
    successful: 80,
    skipped: 0,
    failed: 0,
  },
  hits: {
    total: {
      value: 10000,
      relation: 'gte',
    },
    max_score: null,
    hits: [],
  },
  aggregations: {
    rows: {
      doc_count_error_upper_bound: 13746838,
      sum_other_doc_count: 498980578,
      buckets: [
        {
          key: 'Texas',
          doc_count: 93706288,
          columns: {
            buckets: [
              {
                key_as_string: '2015-01-01T00:00:00.000Z',
                key: 1420070400000,
                doc_count: 13726923,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 40818383543.30431,
                },
              },
              {
                key_as_string: '2016-01-01T00:00:00.000Z',
                key: 1451606400000,
                doc_count: 13999554,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 53975015690.61513,
                },
              },
              {
                key_as_string: '2017-01-01T00:00:00.000Z',
                key: 1483228800000,
                doc_count: 14589244,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 49625004761.14824,
                },
              },
              {
                key_as_string: '2018-01-01T00:00:00.000Z',
                key: 1514764800000,
                doc_count: 13502657,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 50403041902.01892,
                },
              },
              {
                key_as_string: '2019-01-01T00:00:00.000Z',
                key: 1546300800000,
                doc_count: 13212674,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 54561721597.93109,
                },
              },
              {
                key_as_string: '2020-01-01T00:00:00.000Z',
                key: 1577836800000,
                doc_count: 11713341,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 65837455223.746216,
                },
              },
              {
                key_as_string: '2021-01-01T00:00:00.000Z',
                key: 1609459200000,
                doc_count: 12765392,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 111915982919.63411,
                },
              },
              {
                key_as_string: '2022-01-01T00:00:00.000Z',
                key: 1640995200000,
                doc_count: 196503,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 679212887.2353557,
                },
              },
            ],
          },
          rows: {
            doc_count_error_upper_bound: 620649,
            sum_other_doc_count: 81659479,
            buckets: [
              {
                key: 'UT Southwestern Medical Center, Texas',
                doc_count: 2709459,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 366093,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 427681295.22747815,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 309655,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 349715876.2523649,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 477800,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 534094469.9774951,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 278740,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 433884354.7425759,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 570589,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1523645819.4667528,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 276859,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 405202148.40473956,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 429723,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1062168834.1281316,
                      },
                    },
                  ],
                },
              },
              {
                key: 'University of Texas MD Anderson Cancer Center, Texas',
                doc_count: 1759501,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 1,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 106,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 1,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 36288.078125,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 518457,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 551030963.958322,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 1241042,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 14133271232.720825,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Northside Independent School District, Texas',
                doc_count: 1275415,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 174974,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 208511933.70193794,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 181477,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 233584498.11485454,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 201730,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 257241923.59024453,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 205320,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 229358285.29477,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 206551,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 373920749.88868135,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 127107,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 328699749.8225332,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 178256,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 273146566.98438656,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Houston ISD, Texas',
                doc_count: 1040612,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 405661,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 733317176.8135929,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 402351,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1157353443.3929923,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 54316,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 308628652.7136762,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 52038,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 615971337.7218331,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 57444,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 486687758.1603987,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 34924,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 330900157.9241868,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 33878,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1040243307.6840149,
                      },
                    },
                  ],
                },
              },
              {
                key: 'City of San Antonio, Texas',
                doc_count: 913268,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 152093,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 896042370.8261116,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 146680,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 864451354.9078454,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 148734,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 772946738.5486655,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 143860,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 945711362.1673043,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 104774,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 877084636.4325669,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 112022,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 983499067.9572065,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 105105,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 990010633.593231,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Garland Independent School District, Texas',
                doc_count: 910732,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 152808,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 107626147.05607362,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 164410,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 195163406.40462467,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 163626,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 135496354.11983985,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 93670,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 186076935.32561028,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 109726,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 94320745.28588206,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 122536,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 98213231.98250695,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 103956,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 58475807.153388225,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Katy Independent School District, Texas',
                doc_count: 869687,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 126216,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 784865026.0584981,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 194180,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1127119459.5862997,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 107260,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 327627428.0622604,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 118051,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 749758407.0101959,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 122687,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 370327518.5307201,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 104413,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 588289855.7105023,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 96880,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 367971703.48179495,
                      },
                    },
                  ],
                },
              },
              {
                key: 'City of Houston, Texas',
                doc_count: 862864,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 31337,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 566581354.0087504,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 145908,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 390022396.4844015,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 102513,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1251543573.2293904,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 161600,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1471072394.01445,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 128581,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1516160689.5592523,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 149288,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2244343595.8088036,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 143637,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2257504407.804558,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Texas Health and Human Services Commission, Texas',
                doc_count: 857554,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 462,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 14279409.188524999,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 59034,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1860153482.06081,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 186577,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2209618533.294587,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 163709,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2436543397.8738627,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 133421,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 3110643651.723983,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 314351,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 28118465903.542313,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Texas A&M University, Texas',
                doc_count: 847717,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 144359,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 249229554.37451193,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 193524,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 776130089.747186,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 147829,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1534088748.8610208,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 129514,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 337811056.2132294,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 83445,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 235858966.63820738,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 70100,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 260212483.30878866,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 78589,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 299233548.80677754,
                      },
                    },
                    {
                      key_as_string: '2022-01-01T00:00:00.000Z',
                      key: 1640995200000,
                      doc_count: 357,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 231150.89057064056,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          key: 'California',
          doc_count: 84762588,
          columns: {
            buckets: [
              {
                key_as_string: '2015-01-01T00:00:00.000Z',
                key: 1420070400000,
                doc_count: 11613108,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 73301024763.43605,
                },
              },
              {
                key_as_string: '2016-01-01T00:00:00.000Z',
                key: 1451606400000,
                doc_count: 12048233,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 80022352465.4592,
                },
              },
              {
                key_as_string: '2017-01-01T00:00:00.000Z',
                key: 1483228800000,
                doc_count: 12227701,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 86344892835.6318,
                },
              },
              {
                key_as_string: '2018-01-01T00:00:00.000Z',
                key: 1514764800000,
                doc_count: 13410833,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 88735720930.41145,
                },
              },
              {
                key_as_string: '2019-01-01T00:00:00.000Z',
                key: 1546300800000,
                doc_count: 13445111,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 99987180915.90016,
                },
              },
              {
                key_as_string: '2020-01-01T00:00:00.000Z',
                key: 1577836800000,
                doc_count: 10902890,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 142803343751.98712,
                },
              },
              {
                key_as_string: '2021-01-01T00:00:00.000Z',
                key: 1609459200000,
                doc_count: 10986050,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 240269825879.10382,
                },
              },
              {
                key_as_string: '2022-01-01T00:00:00.000Z',
                key: 1640995200000,
                doc_count: 128662,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 16351582557.382181,
                },
              },
            ],
          },
          rows: {
            doc_count_error_upper_bound: 283965,
            sum_other_doc_count: 47833322,
            buckets: [
              {
                key: 'County of Los Angeles, California',
                doc_count: 11749880,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 800687,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 855956458.320953,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 745799,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 761536686.1538666,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 1184406,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 977504838.2610358,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 2286733,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1290225411.7470722,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 2659144,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1382775549.200411,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 1694918,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1438871981.9778776,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 2371501,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1610098693.0521576,
                      },
                    },
                    {
                      key_as_string: '2022-01-01T00:00:00.000Z',
                      key: 1640995200000,
                      doc_count: 6692,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 254626.140231248,
                      },
                    },
                  ],
                },
              },
              {
                key: 'University of California-Los Angeles, California',
                doc_count: 10036578,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 1637172,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 468268011.52564055,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 1491851,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 605434958.4641398,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 1508926,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 967591686.6087141,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 1534027,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1084886497.7056525,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 1564947,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1024999030.2356435,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 1394175,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 560845626.0823094,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 905480,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 308191099.0364471,
                      },
                    },
                  ],
                },
              },
              {
                key: 'County of Santa Clara, California',
                doc_count: 3680140,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 168830,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 139695549.27441883,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 529037,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 189076670.05729523,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 528314,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 156212390.34899202,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 658894,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 199664696.14438426,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 689158,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 323672469.9989079,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 611987,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 542527849.8258852,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 493920,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 372744588.27050626,
                      },
                    },
                  ],
                },
              },
              {
                key: 'City of Los Angeles, California',
                doc_count: 3026913,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 713297,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 8064823756.352752,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 483815,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 4374631344.543575,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 296002,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 3753790132.147543,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 510601,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 4549035109.265227,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 318595,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2437237025.7000446,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 523878,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 6640856123.5621,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 180725,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 3120506685.4529305,
                      },
                    },
                  ],
                },
              },
              {
                key: 'El Camino Hospital, California',
                doc_count: 1917674,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 268319,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 163415302.1590805,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 271281,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 140251239.9178825,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 284984,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 202249161.86620504,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 276582,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 159489782.54263002,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 299069,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 206581796.81689453,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 262213,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 203125343.0743185,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 255226,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 211524150.88029328,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Los Angeles Unified School District, California',
                doc_count: 1674616,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 224196,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 809914967.1947151,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 249347,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 926066682.1555111,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 292303,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 854768538.4961048,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 313833,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1043579047.3066953,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 324840,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1308754980.4633164,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 170293,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 614166296.3537201,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 99804,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 295827818.36165905,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Kaweah Delta Health Care District, California',
                doc_count: 1601346,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 281472,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 72851091.46657173,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 301598,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 72335958.19176896,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 331807,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 84790255.93593477,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 353128,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 102695315.08956897,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 333341,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 101481630.24887854,
                      },
                    },
                  ],
                },
              },
              {
                key: 'City of San Francisco, California',
                doc_count: 1313705,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 43,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 208148.9212048333,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 0,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 0,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 0,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 0,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 0,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 0,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 258696,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 22896464944.31712,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 453275,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 51631191860.95283,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 569034,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 148602055581.23105,
                      },
                    },
                    {
                      key_as_string: '2022-01-01T00:00:00.000Z',
                      key: 1640995200000,
                      doc_count: 32657,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 13873912961.244883,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Port of Los Angeles, California',
                doc_count: 996348,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 220920,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 203526188.19880018,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 267054,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 195066189.121959,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 55690,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 141419825.17116866,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 24909,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 201370227.7349437,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 33684,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 302644169.09161043,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 61782,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 486938294.0024869,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 332309,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 5999607828.787248,
                      },
                    },
                  ],
                },
              },
              {
                key: 'California State University Office of the Chancellor, California',
                doc_count: 932066,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 37064,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 458387592.0304331,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 37995,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 549012159.2731901,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 41974,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 664781614.3362185,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 49999,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1491463507.9609091,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 91357,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 516590222.1615864,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 332678,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2205332557.462962,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 324578,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2208060436.3063846,
                      },
                    },
                    {
                      key_as_string: '2022-01-01T00:00:00.000Z',
                      key: 1640995200000,
                      doc_count: 16421,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 91297496.97424409,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          key: 'Ohio',
          doc_count: 73685884,
          columns: {
            buckets: [
              {
                key_as_string: '2015-01-01T00:00:00.000Z',
                key: 1420070400000,
                doc_count: 12308063,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 44107513575.074615,
                },
              },
              {
                key_as_string: '2016-01-01T00:00:00.000Z',
                key: 1451606400000,
                doc_count: 12490114,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 42587645051.170616,
                },
              },
              {
                key_as_string: '2017-01-01T00:00:00.000Z',
                key: 1483228800000,
                doc_count: 12087499,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 45411237730.38537,
                },
              },
              {
                key_as_string: '2018-01-01T00:00:00.000Z',
                key: 1514764800000,
                doc_count: 12026091,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 46754783084.17153,
                },
              },
              {
                key_as_string: '2019-01-01T00:00:00.000Z',
                key: 1546300800000,
                doc_count: 9984284,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 40034220469.81086,
                },
              },
              {
                key_as_string: '2020-01-01T00:00:00.000Z',
                key: 1577836800000,
                doc_count: 7882549,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 37979646851.39334,
                },
              },
              {
                key_as_string: '2021-01-01T00:00:00.000Z',
                key: 1609459200000,
                doc_count: 6798995,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 45343961395.40337,
                },
              },
              {
                key_as_string: '2022-01-01T00:00:00.000Z',
                key: 1640995200000,
                doc_count: 108289,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 600081554.0717431,
                },
              },
            ],
          },
          rows: {
            doc_count_error_upper_bound: 330634,
            sum_other_doc_count: 62149151,
            buckets: [
              {
                key: 'Ohio State University, Ohio',
                doc_count: 5130882,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 931042,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 944716782.0853306,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 993317,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 878477336.6375483,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 552047,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 386075808.0624915,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 878241,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 922864594.3267057,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 927414,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1082078926.9835434,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 595815,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1025951713.0194093,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 253006,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 564349487.5632913,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Greene County Court of Commons Pleas, Ohio',
                doc_count: 1078624,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 133497,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 337094615.03593004,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 274482,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 399856503.76012534,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 612213,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 808012097.1413332,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 45944,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 382314589.45110136,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 12488,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 163100860.45687196,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Lakota Local School District, Ohio',
                doc_count: 885499,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 123240,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 184036031.53516608,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 117608,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 191887880.33711565,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 121994,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 210893473.90937048,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 89372,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 161161762.8823921,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 134732,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 232374447.28720602,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 132013,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 246139737.3746686,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 151783,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 258286659.7662027,
                      },
                    },
                    {
                      key_as_string: '2022-01-01T00:00:00.000Z',
                      key: 1640995200000,
                      doc_count: 14757,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 30683405.076529097,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Greene County, Ohio',
                doc_count: 824745,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 105801,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 345971056.83629596,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 200001,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 351749206.5323813,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 325098,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 388277141.70397156,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 45919,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 382295897.7311383,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 43148,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 388675316.3771105,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 101058,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 591262425.3895558,
                      },
                    },
                    {
                      key_as_string: '2022-01-01T00:00:00.000Z',
                      key: 1640995200000,
                      doc_count: 3720,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 10821083.009542169,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Westerville City School District, Ohio',
                doc_count: 821493,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 122965,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 117670787.27831554,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 125296,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 121987778.86378732,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 131858,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 121129845.42649305,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 132172,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 126728111.06059378,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 128444,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 143816444.84417236,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 97050,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 100284587.34037836,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 83708,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 107284202.99415459,
                      },
                    },
                  ],
                },
              },
              {
                key: 'City of Columbus, Ohio',
                doc_count: 596072,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 19231,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1088086275.4557664,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 79768,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 780646100.7362994,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 123254,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 830846180.2505252,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 124085,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 875411342.7512934,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 129310,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 918972579.7908059,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 112037,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1115668948.0874288,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 8387,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 80116427.05837566,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Dayton City School District, Ohio',
                doc_count: 594213,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 157817,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 379909238.89549845,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 154605,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 331733740.6167592,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 155835,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 336156278.8081824,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 106883,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 192388117.00646603,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 19073,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 25241448.906738244,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Sylvania City School District, Ohio',
                doc_count: 558958,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 86289,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 189792555.48927623,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 85631,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 112621581.1214219,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 85186,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 112495173.3211033,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 85163,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 101585241.28796443,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 88840,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 108214512.57595685,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 78781,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 108899597.02516042,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 49068,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 69089064.66015494,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Stark County, Ohio',
                doc_count: 534331,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 91711,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 178320121.21744356,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 88596,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 178888833.24817896,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 136374,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 309482776.860608,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 170089,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 673623601.2908489,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 12282,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 64728146.13455488,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 22932,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 79760384.91948535,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 12347,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 61521208.422730915,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Cleveland Metropolitan School District, Ohio',
                doc_count: 511916,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 57937,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 151884851.1484564,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 89864,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 199151937.54017636,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 88545,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 179137029.46312943,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 99748,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 62992010.33592836,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 84326,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 44638524.122993395,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 27258,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 49633695.291435495,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 64238,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 57339177.476826526,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          key: 'Virginia',
          doc_count: 51957941,
          columns: {
            buckets: [
              {
                key_as_string: '2015-01-01T00:00:00.000Z',
                key: 1420070400000,
                doc_count: 6483997,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 55054828223.72627,
                },
              },
              {
                key_as_string: '2016-01-01T00:00:00.000Z',
                key: 1451606400000,
                doc_count: 8013238,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 68846759726.835,
                },
              },
              {
                key_as_string: '2017-01-01T00:00:00.000Z',
                key: 1483228800000,
                doc_count: 8508673,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 79754772139.89061,
                },
              },
              {
                key_as_string: '2018-01-01T00:00:00.000Z',
                key: 1514764800000,
                doc_count: 8810952,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 88428290708.72752,
                },
              },
              {
                key_as_string: '2019-01-01T00:00:00.000Z',
                key: 1546300800000,
                doc_count: 7670462,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 80282270230.53542,
                },
              },
              {
                key_as_string: '2020-01-01T00:00:00.000Z',
                key: 1577836800000,
                doc_count: 6375792,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 72472271910.44333,
                },
              },
              {
                key_as_string: '2021-01-01T00:00:00.000Z',
                key: 1609459200000,
                doc_count: 6084440,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 67599818085.91897,
                },
              },
              {
                key_as_string: '2022-01-01T00:00:00.000Z',
                key: 1640995200000,
                doc_count: 10387,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 81117769.23469706,
                },
              },
            ],
          },
          rows: {
            doc_count_error_upper_bound: 142438,
            sum_other_doc_count: 13090303,
            buckets: [
              {
                key: 'Department of Defense: Defense Logistics Agency, Virginia',
                doc_count: 22465914,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 2429486,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 29338697187.95801,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 2973749,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 31244767620.18832,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 3166235,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 37010728991.98204,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 3795588,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 45243888148.04858,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 3556929,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 43096502750.092384,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 3276034,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 39977021147.13795,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 3267893,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 38014704939.18509,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Department of Defense: Defense Logistics Agency - Central, Virginia',
                doc_count: 5304835,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 709816,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 5174355951.433523,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 784419,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 5409517286.661414,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 900181,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 6963923814.752107,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 1004037,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 9000396343.544085,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 786840,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 7835585474.52041,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 687128,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 6273918245.402502,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 432414,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 3943923544.9594917,
                      },
                    },
                  ],
                },
              },
              {
                key: 'City of Richmond, Virginia',
                doc_count: 2728931,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 430623,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2824759980.8626943,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 777209,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 6529028629.221311,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 841617,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 7633042637.482737,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 559373,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 4274524828.9479375,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 120077,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1128120982.6675603,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 2,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 35208.33984375,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 30,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 464738.621509552,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Defense Contract Management Agency (DCMA) - DLA, Virginia',
                doc_count: 2509426,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 501885,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1988325270.3895478,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 471421,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2233338770.0199895,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 479820,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2301680458.672028,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 290731,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1597091961.8515067,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 246072,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1441208286.6282704,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 322537,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1574538264.3029613,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 196960,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 860892956.0824735,
                      },
                    },
                  ],
                },
              },
              {
                key: 'University of Virginia, Virginia',
                doc_count: 2179770,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 218415,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 729757891.6652749,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 296273,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1446368041.4480355,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 323695,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2323981005.00945,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 336352,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2344544118.9220924,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 321338,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2793367744.696856,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 296498,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 3163370504.4897356,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 387199,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2814285441.3972964,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Virginia Polytechnic Institute And State University, Virginia',
                doc_count: 1242113,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 147445,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 140870266.6345325,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 202846,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 245332073.6964694,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 207112,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 182290753.29590377,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 214599,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 199217217.7235588,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 203280,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 294543205.02167195,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 128034,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 214703313.9307175,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 138797,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 360597317.8202142,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Virginia Commonwealth University, Virginia',
                doc_count: 834338,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 113869,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 489217836.19476074,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 157843,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 942775644.1941687,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 148816,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 783125175.8428246,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 146365,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 745799443.8301573,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 113813,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 776806643.0828311,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 85625,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 491297064.9292949,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 68007,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 600706900.6299247,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Virginia Department of Transportation, Virginia',
                doc_count: 608268,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 67657,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 5941382054.16591,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 100400,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 10148886362.738218,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 101194,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 10412816549.884453,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 99241,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 10292113005.231426,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 99039,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 10024857531.292627,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 76031,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 7847442318.076566,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 64706,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 7079227613.111764,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Fairfax County Schools, Virginia',
                doc_count: 567831,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 116921,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 167464505.70306718,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 99880,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 155769211.80703244,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 101093,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 166058205.0817033,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 112496,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 190752314.3230191,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 116148,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 118753284.91224281,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 21292,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 47279857.929658815,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 1,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 15929.7998046875,
                      },
                    },
                  ],
                },
              },
              {
                key: 'George Mason University, Virginia',
                doc_count: 426212,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 48530,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 227623320.9852117,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 65508,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 189687441.28853792,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 67208,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 207968346.98961625,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 80943,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 438908604.3881104,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 73038,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 504432982.6253894,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 43527,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 602283115.3202825,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 47458,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 366071901.68294,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          key: 'Florida',
          doc_count: 45227342,
          columns: {
            buckets: [
              {
                key_as_string: '2015-01-01T00:00:00.000Z',
                key: 1420070400000,
                doc_count: 7644255,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 28877089539.518425,
                },
              },
              {
                key_as_string: '2016-01-01T00:00:00.000Z',
                key: 1451606400000,
                doc_count: 6901170,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 31703014939.204056,
                },
              },
              {
                key_as_string: '2017-01-01T00:00:00.000Z',
                key: 1483228800000,
                doc_count: 6642680,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 35891600254.930595,
                },
              },
              {
                key_as_string: '2018-01-01T00:00:00.000Z',
                key: 1514764800000,
                doc_count: 7337186,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 36953673210.86279,
                },
              },
              {
                key_as_string: '2019-01-01T00:00:00.000Z',
                key: 1546300800000,
                doc_count: 6611225,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 34684643582.87635,
                },
              },
              {
                key_as_string: '2020-01-01T00:00:00.000Z',
                key: 1577836800000,
                doc_count: 5250530,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 38852711718.670586,
                },
              },
              {
                key_as_string: '2021-01-01T00:00:00.000Z',
                key: 1609459200000,
                doc_count: 4813562,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 141990535242.46323,
                },
              },
              {
                key_as_string: '2022-01-01T00:00:00.000Z',
                key: 1640995200000,
                doc_count: 26734,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 301807348.79818183,
                },
              },
            ],
          },
          rows: {
            doc_count_error_upper_bound: 284806,
            sum_other_doc_count: 27292910,
            buckets: [
              {
                key: 'Jackson Health System, Florida',
                doc_count: 10566550,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 1475248,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 431331260.6348086,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 1605176,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 616433114.8144027,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 1440250,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 418996809.91123307,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 1580224,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 748905186.1941358,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 1646571,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 437860296.8726363,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 1528798,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 603401466.7346642,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 1290283,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 294669751.10560983,
                      },
                    },
                  ],
                },
              },
              {
                key: 'University of Florida, Florida',
                doc_count: 1470427,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 199340,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 480937949.9246979,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 117571,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 481623475.99830836,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 187947,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 453644127.3236454,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 248050,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 626655325.4161991,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 245270,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 490273077.5671576,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 225606,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 636831838.7022102,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 246643,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 898390607.8203102,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Broward County Public Schools, Florida',
                doc_count: 1251690,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 448933,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 318171433.28112084,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 280842,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 382285318.8116973,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 131228,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 417745350.3487483,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 146633,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 448733812.13234127,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 62890,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 395682515.06644666,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 79386,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 611441567.436177,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 101778,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 370832036.07079726,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Florida Department of Health, Florida',
                doc_count: 896808,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 124364,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 792042337.5975928,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 139018,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 664689472.7200325,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 67251,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 476348954.6411916,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 176688,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 418595865.6541151,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 97071,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 268165159.71578452,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 139848,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 492474751.7914833,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 152568,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1068812224.1002,
                      },
                    },
                  ],
                },
              },
              {
                key: 'City of Milton, Florida',
                doc_count: 758593,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 687365,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 173896677.90216407,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 11902,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 6834948.386292553,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 12785,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 7642509.389692834,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 12842,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 7376474.343896825,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 13177,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 10766156.101967614,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 11425,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 10807819.865659239,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 9097,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 8926492.445997456,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Halifax Medical Center, Florida',
                doc_count: 684688,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 114787,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 60355988.45361977,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 99727,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 38370920.954010814,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 141625,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 62217280.81008497,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 109824,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 78577898.85420248,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 107902,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 52096016.600640714,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 32106,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 27811225.143113997,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 76550,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 54196269.44021846,
                      },
                    },
                    {
                      key_as_string: '2022-01-01T00:00:00.000Z',
                      key: 1640995200000,
                      doc_count: 2167,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 428285.3591257334,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Orange County Board of County Commissioners, Florida',
                doc_count: 621996,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 85734,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 496265365.66493064,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 89263,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 565557005.4793801,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 92082,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 508207908.0995359,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 104887,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 900322787.9744796,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 89282,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 571590059.379493,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 66209,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 514637368.94637233,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 94539,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1636465127.006126,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Nassau County School District, Florida',
                doc_count: 567478,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 276,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 818821.446773529,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 1,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 3500,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 4611,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 3790147.2906754874,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 228527,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 507821452.6396711,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 334063,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 741970114.0904645,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Florida Department of Corrections, Florida',
                doc_count: 562072,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 137498,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 258234282.48274487,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 69581,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 258243048.86787534,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 35734,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 221714087.7262244,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 94237,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 345626900.2194476,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 61768,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 316713322.9101308,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 74660,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 379460938.3632871,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 88594,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 381934411.92263055,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Okeechobee County Schools, Florida',
                doc_count: 554130,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 149661,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 256738035.7942673,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 161271,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 282053827.3543684,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 195607,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 328414189.0486216,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 26707,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 61396172.02071668,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 7118,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 17203267.079337835,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 6901,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 20789199.917884864,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 6408,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 19014291.061674424,
                      },
                    },
                    {
                      key_as_string: '2022-01-01T00:00:00.000Z',
                      key: 1640995200000,
                      doc_count: 457,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1201958.7514693737,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          key: 'New York',
          doc_count: 42497155,
          columns: {
            buckets: [
              {
                key_as_string: '2015-01-01T00:00:00.000Z',
                key: 1420070400000,
                doc_count: 5924298,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 92012245632.09465,
                },
              },
              {
                key_as_string: '2016-01-01T00:00:00.000Z',
                key: 1451606400000,
                doc_count: 9069997,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 181433502377.86087,
                },
              },
              {
                key_as_string: '2017-01-01T00:00:00.000Z',
                key: 1483228800000,
                doc_count: 6153071,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 137660222606.12885,
                },
              },
              {
                key_as_string: '2018-01-01T00:00:00.000Z',
                key: 1514764800000,
                doc_count: 6293083,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 63114199829.22119,
                },
              },
              {
                key_as_string: '2019-01-01T00:00:00.000Z',
                key: 1546300800000,
                doc_count: 5783601,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 73620975837.57465,
                },
              },
              {
                key_as_string: '2020-01-01T00:00:00.000Z',
                key: 1577836800000,
                doc_count: 4610855,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 63657859066.34587,
                },
              },
              {
                key_as_string: '2021-01-01T00:00:00.000Z',
                key: 1609459200000,
                doc_count: 4581748,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 78583377316.29979,
                },
              },
              {
                key_as_string: '2022-01-01T00:00:00.000Z',
                key: 1640995200000,
                doc_count: 80502,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 2850050929.4705133,
                },
              },
            ],
          },
          rows: {
            doc_count_error_upper_bound: 201368,
            sum_other_doc_count: 32087651,
            buckets: [
              {
                key: 'State University of New York SUNY Buffalo, New York',
                doc_count: 1787226,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 286173,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2335764099.263014,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 162484,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1178342276.7250254,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 285321,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2060780574.0414743,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 282141,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1873765570.1342547,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 285795,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2331216921.241306,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 220582,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2251577979.2912807,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 264730,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2931310166.731831,
                      },
                    },
                  ],
                },
              },
              {
                key: 'City of New York, New York',
                doc_count: 1713517,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 482257,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 20188141775.95046,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 533417,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 20834278428.57335,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 648520,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 77210864787.17622,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 13261,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 49376236,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 24527,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1706157082.09878,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 10541,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1049614780.9241128,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 994,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 4494885.675069332,
                      },
                    },
                  ],
                },
              },
              {
                key: 'New York City Department of Finance, New York',
                doc_count: 1698142,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 15266,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2118829553.4428382,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 1642089,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 50348587716.02908,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 8992,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1729453697.8809497,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 9245,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1707091450.9022534,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 8424,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1942511572.2240703,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 4852,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1143300815.601175,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 8126,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2165339895.097352,
                      },
                    },
                    {
                      key_as_string: '2022-01-01T00:00:00.000Z',
                      key: 1640995200000,
                      doc_count: 1148,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 366680646.41166854,
                      },
                    },
                  ],
                },
              },
              {
                key: 'New York City Council, New York',
                doc_count: 1682396,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 8603,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 58523156.58882333,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 1641547,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 49542311686.30739,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 7058,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 13468323.179246146,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 7003,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 14372016.3587178,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 6908,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 16597932.337320061,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 5104,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 15129443.82989034,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 5591,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 48076185.71054558,
                      },
                    },
                    {
                      key_as_string: '2022-01-01T00:00:00.000Z',
                      key: 1640995200000,
                      doc_count: 582,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 6263386.970146179,
                      },
                    },
                  ],
                },
              },
              {
                key: 'SUNY Upstate Medical University, New York',
                doc_count: 881125,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 118235,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 201589186.27263218,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 123164,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 175383250.95175287,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 119649,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 228280363.87627584,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 133754,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 267595898.03380445,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 137533,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 316726033.32685554,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 131622,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 540659407.4660772,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 117168,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 460292140.29780674,
                      },
                    },
                  ],
                },
              },
              {
                key: 'New York City School Construction Authority, New York',
                doc_count: 704720,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 123854,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2721734228.5938993,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 103949,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2641631376.6199746,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 93405,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2422818208.146429,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 98205,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2798582741.33351,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 94127,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2805723559.6118207,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 94946,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2229493430.8461637,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 89589,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2679363993.0237074,
                      },
                    },
                    {
                      key_as_string: '2022-01-01T00:00:00.000Z',
                      key: 1640995200000,
                      doc_count: 6645,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 183979864.5758486,
                      },
                    },
                  ],
                },
              },
              {
                key: 'New York City Department of Education, New York',
                doc_count: 644795,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 19234,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 3786369.2711028904,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 20982,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 4668838.368507713,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 24159,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 4709828.582573745,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 580420,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1809714210.2493064,
                      },
                    },
                  ],
                },
              },
              {
                key: 'NYC Department of Environmental Protection, New York',
                doc_count: 481040,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 141432,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 4203501470.54096,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 68657,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2135492480.3489537,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 57327,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2085551841.3151991,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 55873,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2203500738.224145,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 62251,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2450113835.788791,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 31825,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1385267930.7046828,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 57740,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2413335116.694272,
                      },
                    },
                    {
                      key_as_string: '2022-01-01T00:00:00.000Z',
                      key: 1640995200000,
                      doc_count: 5935,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 213422384.63502574,
                      },
                    },
                  ],
                },
              },
              {
                key: 'New York City Transit Authority, New York',
                doc_count: 447012,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 40763,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2908387680.6274877,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 71050,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 5121805879.451541,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 89983,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 7711417423.034992,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 85479,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 7894723397.623888,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 80101,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 6569603904.163625,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 59644,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 4793394373.945479,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 19992,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 366137483.2485449,
                      },
                    },
                  ],
                },
              },
              {
                key: "New York City Comptroller's Office, New York",
                doc_count: 369531,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 171051,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 9192035762.956491,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 188167,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 9958225886.203337,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 1961,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 29025097.298516512,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 1870,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 28132029.52236271,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 2068,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 29971966.624749422,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 1171,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 24403324.108641922,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 2946,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 77377706.67946236,
                      },
                    },
                    {
                      key_as_string: '2022-01-01T00:00:00.000Z',
                      key: 1640995200000,
                      doc_count: 297,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 7730185.210816145,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          key: 'Illinois',
          doc_count: 41643169,
          columns: {
            buckets: [
              {
                key_as_string: '2015-01-01T00:00:00.000Z',
                key: 1420070400000,
                doc_count: 5977988,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 31515971803.93662,
                },
              },
              {
                key_as_string: '2016-01-01T00:00:00.000Z',
                key: 1451606400000,
                doc_count: 5959654,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 32820356088.245293,
                },
              },
              {
                key_as_string: '2017-01-01T00:00:00.000Z',
                key: 1483228800000,
                doc_count: 6219762,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 34092072964.081978,
                },
              },
              {
                key_as_string: '2018-01-01T00:00:00.000Z',
                key: 1514764800000,
                doc_count: 6532085,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 36511199691.674225,
                },
              },
              {
                key_as_string: '2019-01-01T00:00:00.000Z',
                key: 1546300800000,
                doc_count: 6495934,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 59996807115.4487,
                },
              },
              {
                key_as_string: '2020-01-01T00:00:00.000Z',
                key: 1577836800000,
                doc_count: 5358241,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 99159397771.4243,
                },
              },
              {
                key_as_string: '2021-01-01T00:00:00.000Z',
                key: 1609459200000,
                doc_count: 5038734,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 49188887942.90791,
                },
              },
              {
                key_as_string: '2022-01-01T00:00:00.000Z',
                key: 1640995200000,
                doc_count: 60771,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 409772452.5921867,
                },
              },
            ],
          },
          rows: {
            doc_count_error_upper_bound: 132005,
            sum_other_doc_count: 34696709,
            buckets: [
              {
                key: 'Chicago Public Schools, Illinois',
                doc_count: 2560815,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 548029,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1906201214.8213305,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 386897,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1426451424.8437145,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 423013,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2060353729.2484708,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 441613,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2332431289.1856394,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 451345,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2343667520.5192204,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 203751,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1980698385.6303773,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 106167,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1339858458.7912102,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Illinois State Department Of Transportation, Illinois',
                doc_count: 953626,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 109764,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 3966151491.310713,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 110812,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 4094121136.419754,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 65963,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1982619193.9431071,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 167963,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 3438207693.9898305,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 168859,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 3619999137.5698276,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 156389,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 4409047183.906761,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 167386,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 4222529735.5940104,
                      },
                    },
                    {
                      key_as_string: '2022-01-01T00:00:00.000Z',
                      key: 1640995200000,
                      doc_count: 6490,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 125682920.66067721,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Cook County, Illinois',
                doc_count: 947134,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 19507,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 758733628.6783988,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 33548,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 774040433.0579039,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 250664,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1722218113.422557,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 210705,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1135925734.961124,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 80911,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 479193482.19384634,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 150137,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 857955040.4128165,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 200601,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2051067343.236464,
                      },
                    },
                    {
                      key_as_string: '2022-01-01T00:00:00.000Z',
                      key: 1640995200000,
                      doc_count: 1061,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1909185.5384920165,
                      },
                    },
                  ],
                },
              },
              {
                key: 'University of Illinois at Chicago, Urbana-Champaign, and Springfield, Illinois',
                doc_count: 862791,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 168942,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 574107493.1414225,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 148069,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1137403719.958909,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 118260,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 308267042.3282978,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 128686,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 262711597.73713472,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 142224,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 321468077.75560576,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 119585,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 396504300.930809,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 37025,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 162888826.017686,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Metra Commuter Rail Board, Illinois',
                doc_count: 387879,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 52152,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 131146005.55102655,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 53015,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 137865938.16181055,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 49262,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 155157092.005513,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 59112,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 285381070.7928735,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 42693,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 234649258.51667622,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 50563,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 268276414.83989543,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 75934,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 601469615.6155074,
                      },
                    },
                    {
                      key_as_string: '2022-01-01T00:00:00.000Z',
                      key: 1640995200000,
                      doc_count: 5148,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 138113751.03092808,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Kane County Community Unit School District No. 300, Illinois',
                doc_count: 304182,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 39047,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 8075223.843233075,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 18928,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 6204480.847935807,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 51531,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 11029512.861868748,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 59518,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 14725730.985376777,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 60561,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 20607982.161102697,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 48690,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 13933324.320885753,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 25907,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 8181491.242335474,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Rockford School District No. 205, Illinois',
                doc_count: 297128,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 29416,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 144354428.66265061,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 27461,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 82302614.48572685,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 58499,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 280707484.7299339,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 75626,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 49846126.04365191,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 54809,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 111636370.12857543,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 35083,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 103175737.30325086,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 16234,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 27040502.210424572,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Illinois Department of Corrections, Illinois',
                doc_count: 258448,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 3680,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 23025841.689286113,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 24307,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 138295902.86128163,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 52947,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 329282968.9445013,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 56934,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 499376350.4459096,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 27475,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 247345546.7425463,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 60160,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 474467188.2796754,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 32945,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 363295376.7721197,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Cicero Public School District No. 99, Illinois',
                doc_count: 206654,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 19309,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 12792508.51178798,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 19163,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 19103505.962399974,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 20697,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 14595774.254997231,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 28150,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 32814621.15524879,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 48611,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 70093980.73268817,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 36929,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 47926014.278924495,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 33795,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 26919828.999272816,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Winnebago County, Illinois',
                doc_count: 167803,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 18922,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 33302711.48506134,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 8105,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 14372206.048696931,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 29244,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 48359154.5769082,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 29000,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 50975028.39009579,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 29903,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 55092931.991407886,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 30564,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 61838630.57527378,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 22065,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 52828348.94134796,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          key: 'Michigan',
          doc_count: 33540553,
          columns: {
            buckets: [
              {
                key_as_string: '2015-01-01T00:00:00.000Z',
                key: 1420070400000,
                doc_count: 4805468,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 13279949734.674892,
                },
              },
              {
                key_as_string: '2016-01-01T00:00:00.000Z',
                key: 1451606400000,
                doc_count: 4451672,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 14086882353.994251,
                },
              },
              {
                key_as_string: '2017-01-01T00:00:00.000Z',
                key: 1483228800000,
                doc_count: 5261105,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 27270333411.697323,
                },
              },
              {
                key_as_string: '2018-01-01T00:00:00.000Z',
                key: 1514764800000,
                doc_count: 5297818,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 17392796141.045986,
                },
              },
              {
                key_as_string: '2019-01-01T00:00:00.000Z',
                key: 1546300800000,
                doc_count: 5358299,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 19343310175.892982,
                },
              },
              {
                key_as_string: '2020-01-01T00:00:00.000Z',
                key: 1577836800000,
                doc_count: 4527636,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 20439229057.44593,
                },
              },
              {
                key_as_string: '2021-01-01T00:00:00.000Z',
                key: 1609459200000,
                doc_count: 3804970,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 23470977507.196445,
                },
              },
              {
                key_as_string: '2022-01-01T00:00:00.000Z',
                key: 1640995200000,
                doc_count: 33585,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 218859204.95522404,
                },
              },
            ],
          },
          rows: {
            doc_count_error_upper_bound: 94520,
            sum_other_doc_count: 15524922,
            buckets: [
              {
                key: 'University of Michigan at Ann Arbor, Michigan',
                doc_count: 14755861,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 2185720,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1924517838.24522,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 1688110,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1670496570.5814028,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 2325879,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2558981738.267619,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 2332161,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2339588936.066932,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 2503197,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2466238392.3476634,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 2189217,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2394202655.9980483,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 1531577,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1798461528.8814204,
                      },
                    },
                  ],
                },
              },
              {
                key: 'County of Macomb, Michigan',
                doc_count: 888775,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 107850,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 337349682.5466754,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 122498,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 393515358.5960023,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 122566,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 511558467.9738291,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 145995,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 407732851.2164686,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 145330,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 391715841.78208655,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 113002,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 440768981.717863,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 131534,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 442185061.7503878,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Michigan State University, Michigan',
                doc_count: 745099,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 113773,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1289517810.119016,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 145810,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 394356707.3611422,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 136419,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 234183981.00886026,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 152330,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 239920437.77636844,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 157624,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 283031114.27037686,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 39143,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 32935781.144350074,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Wayne State University, Michigan',
                doc_count: 400115,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 71053,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 166587296.7252629,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 57630,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 143350966.60421005,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 65698,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 126634100.10327044,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 51897,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 176040326.49547914,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 66983,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 219359856.36789295,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 44605,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 184917345.9787231,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 42249,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 149062776.75889233,
                      },
                    },
                  ],
                },
              },
              {
                key: 'City of Detroit, Michigan',
                doc_count: 269919,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 34310,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 594025456.1935072,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 44724,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 660548922.8857422,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 54755,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 993514852.1234007,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 69205,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 548937294.5828755,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 23869,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 720757106.819383,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 15564,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 488051345.5109168,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 26315,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 897123932.9218673,
                      },
                    },
                    {
                      key_as_string: '2022-01-01T00:00:00.000Z',
                      key: 1640995200000,
                      doc_count: 1177,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 64189194.21527606,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Michigan State Department Of Corrections, Michigan',
                doc_count: 225508,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 5208,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 14286894.606662884,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 0,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 0,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 37899,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 709381382.7639513,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 57820,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 844046060.9429737,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 52145,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 331771675.2364088,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 37888,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 392786412.2921533,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 34548,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 301304801.29935175,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Washtenaw County, Michigan',
                doc_count: 209602,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 50996,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 182766423.88811037,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 28107,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 106095656.56334999,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 29200,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 108312973.49848348,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 20799,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 74242781.3391243,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 21889,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 94796687.58535595,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 18612,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 91739464.06838003,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 39999,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 234789941.4455777,
                      },
                    },
                  ],
                },
              },
              {
                key: 'City of Kalamazoo, Michigan',
                doc_count: 207752,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 38415,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 83666710.92745462,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 32383,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 93559695.41106792,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 26176,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 84400908.46012253,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 22212,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 98906432.30649486,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 36896,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 129949937.71535975,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 29052,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 140835112.85088474,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 22618,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 110978941.39050396,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Michigan State Department Of Health & Human Services, Michigan',
                doc_count: 156867,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 154,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1848705.5217959974,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 0,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 0,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 9429,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 81327728.38884905,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 46310,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 279446855.8670117,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 40778,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 344939033.7607608,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 35988,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 432256374.72150594,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 24208,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 469166228.64112127,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Michigan State Department Of Natural Resources, Michigan',
                doc_count: 156133,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 928,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 16805202.691260345,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 126,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 5123878.812585831,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 10576,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 204767569.64753821,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 35913,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 123104900.02173363,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 35656,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 87657003.9109078,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 36526,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 86019853.619858,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 36408,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 88418044.98398325,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          key: 'Washington',
          doc_count: 33329430,
          columns: {
            buckets: [
              {
                key_as_string: '2015-01-01T00:00:00.000Z',
                key: 1420070400000,
                doc_count: 4974968,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 14712719299.410099,
                },
              },
              {
                key_as_string: '2016-01-01T00:00:00.000Z',
                key: 1451606400000,
                doc_count: 5591411,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 18864955002.788235,
                },
              },
              {
                key_as_string: '2017-01-01T00:00:00.000Z',
                key: 1483228800000,
                doc_count: 5366677,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 21750272284.908867,
                },
              },
              {
                key_as_string: '2018-01-01T00:00:00.000Z',
                key: 1514764800000,
                doc_count: 5208975,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 28425391378.778187,
                },
              },
              {
                key_as_string: '2019-01-01T00:00:00.000Z',
                key: 1546300800000,
                doc_count: 4736370,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 30046730122.15636,
                },
              },
              {
                key_as_string: '2020-01-01T00:00:00.000Z',
                key: 1577836800000,
                doc_count: 4520766,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 34472595340.41068,
                },
              },
              {
                key_as_string: '2021-01-01T00:00:00.000Z',
                key: 1609459200000,
                doc_count: 2915776,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 17954476395.225666,
                },
              },
              {
                key_as_string: '2022-01-01T00:00:00.000Z',
                key: 1640995200000,
                doc_count: 14487,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 130193241.35138677,
                },
              },
            ],
          },
          rows: {
            doc_count_error_upper_bound: 154974,
            sum_other_doc_count: 23304477,
            buckets: [
              {
                key: 'University of Washington, Washington',
                doc_count: 4944799,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 60823,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 3151391386.812817,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 918807,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 8467055604.524697,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 1315843,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 13276439232.532576,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 1675094,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 19703598008.043053,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 974232,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 8723866649.979282,
                      },
                    },
                  ],
                },
              },
              {
                key: 'University of Washington Medical Center, Washington',
                doc_count: 1685040,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 268183,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 240381602.64663023,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 455307,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 2465624152.4130497,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 554075,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 211853088.55936524,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 381118,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 4067584895.961236,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 26357,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1637456159.469983,
                      },
                    },
                  ],
                },
              },
              {
                key: 'King County, Washington',
                doc_count: 992466,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 140229,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1067778478.3485049,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 189779,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1888247122.661861,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 183358,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1643693759.3236086,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 167230,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1799968120.904611,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 162448,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1829755771.0817423,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 148337,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1944885912.3733616,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 1085,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 14338687.564737111,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Mukilteo School District, Washington',
                doc_count: 567915,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 179769,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 545061536.5269437,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 369055,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 487063437.42351246,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 9543,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 31045978.441358022,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 4342,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 18131713.329768434,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 1492,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 7519991.149151344,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 2177,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 35937592.42750232,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 1537,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 18597800.852223396,
                      },
                    },
                  ],
                },
              },
              {
                key: 'City of Tacoma, Washington',
                doc_count: 381463,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 67745,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 8503174.795437671,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 72295,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 195292298.77473363,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 64021,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 241975820.5118933,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 86003,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 333691184.0311504,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 91397,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 261451867.597217,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 2,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 151660,
                      },
                    },
                  ],
                },
              },
              {
                key: 'City of Omak, Washington',
                doc_count: 306668,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 55214,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 10410396.197259527,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 72299,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 25538249.650908146,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 18176,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 10988910.956965344,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 23734,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 18138696.03007917,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 86721,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 15889750.807386978,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 45756,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 27662340.39031398,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 4768,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 514408.78921408206,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Tacoma Public Utilities, Washington',
                doc_count: 291984,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 29124,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 118918529.2211301,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 30115,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 111165375.0520126,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 39070,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 140218133.3583821,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 38363,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1149775413.5961156,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 72329,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1648413566.6380146,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 60267,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 275776910.6677311,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 22716,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 67469480.30046657,
                      },
                    },
                  ],
                },
              },
              {
                key: 'City of Selah, Washington',
                doc_count: 288710,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 29673,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 14257912.479406752,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 83696,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 34766820.87776017,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 79997,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 65763637.16316926,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 58043,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 64214388.74347761,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 26047,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 31083030.36971367,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 7693,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 23440477.209637664,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 3561,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 13601009.948939076,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Pasco School District, Washington',
                doc_count: 287279,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 63027,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 66232286.41513762,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 73667,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 50490844.7031233,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 58209,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 50475782.309398256,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 35360,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 32227456.80725155,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 27759,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 78276219.50157899,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 16024,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 92334202.08106118,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 13233,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 32001225.19412395,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Seattle School District 1, Washington',
                doc_count: 278629,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 35059,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 65277838.28845466,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 36200,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 29177898.26037371,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 44132,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 44029694.34226766,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 47009,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 155384320.26729935,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 51369,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 332705407.2334956,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 30137,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 156471344.89310434,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 34723,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 286074766.2996632,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          key: 'New Jersey',
          doc_count: 31451070,
          columns: {
            buckets: [
              {
                key_as_string: '2015-01-01T00:00:00.000Z',
                key: 1420070400000,
                doc_count: 5025311,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 41656352897.484344,
                },
              },
              {
                key_as_string: '2016-01-01T00:00:00.000Z',
                key: 1451606400000,
                doc_count: 5000402,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 42033456513.1396,
                },
              },
              {
                key_as_string: '2017-01-01T00:00:00.000Z',
                key: 1483228800000,
                doc_count: 4815683,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 41600708595.394196,
                },
              },
              {
                key_as_string: '2018-01-01T00:00:00.000Z',
                key: 1514764800000,
                doc_count: 4536911,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 40417681190.20396,
                },
              },
              {
                key_as_string: '2019-01-01T00:00:00.000Z',
                key: 1546300800000,
                doc_count: 4507419,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 43291776534.50964,
                },
              },
              {
                key_as_string: '2020-01-01T00:00:00.000Z',
                key: 1577836800000,
                doc_count: 3988215,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 45487201336.46025,
                },
              },
              {
                key_as_string: '2021-01-01T00:00:00.000Z',
                key: 1609459200000,
                doc_count: 3546620,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 53589866373.63681,
                },
              },
              {
                key_as_string: '2022-01-01T00:00:00.000Z',
                key: 1640995200000,
                doc_count: 30509,
                'pivotMetric-sum-LineItem.TotalPrice': {
                  value: 493980697.6562287,
                },
              },
            ],
          },
          rows: {
            doc_count_error_upper_bound: 154879,
            sum_other_doc_count: 28723862,
            buckets: [
              {
                key: 'Newark Public Schools, New Jersey',
                doc_count: 384565,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 72821,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1115648895.6020055,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 42716,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 458236316.10245085,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 38790,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 519896895.2713652,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 25220,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 647410086.1828665,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 64912,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 643768709.2251718,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 85398,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 826685233.7980154,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 54708,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 927447412.879233,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Monmouth County, New Jersey',
                doc_count: 331048,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 46599,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1073643574.1674768,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 60053,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1120517013.0038047,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 44931,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1033463903.1657633,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 45357,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1043940132.2504836,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 51164,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1102051610.424512,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 46141,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1304494723.9315271,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 36803,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1118312178.3988101,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Hudson County, New Jersey',
                doc_count: 300989,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 33666,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 313364005.62592083,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 31548,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 325563401.76166075,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 52911,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 443585353.8907968,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 29613,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 621082100.3241718,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 57103,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 546626125.359177,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 55337,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 618754371.9872228,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 40811,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 464144785.64309245,
                      },
                    },
                  ],
                },
              },
              {
                key: 'County of Morris, New Jersey',
                doc_count: 290330,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 93429,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1853729792.3368142,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 67572,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1038417445.8634813,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 67011,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1059631069.7736945,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 28867,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 149116382.33110827,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 30050,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 465298985.10002273,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 3401,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 62277401.486607075,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Hackensack Public Schools, New Jersey',
                doc_count: 284144,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 46582,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 45213270.56265357,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 41910,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 105843661.29828179,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 43529,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 49933005.038580745,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 41642,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 53745153.339336336,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 48544,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 47051672.22104724,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 44835,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 68288688.4780167,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 17102,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 6387944.331929237,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Brick Township Public Schools, New Jersey',
                doc_count: 249246,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 42883,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 241652337.7785588,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 38658,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 200128246.31856528,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 43768,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 184559317.67089358,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 45153,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 146429699.09582984,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 44879,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 82180781.60194118,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 31385,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 141656097.80442265,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 2520,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 5563515.483472034,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Vineland Public Schools, New Jersey',
                doc_count: 225521,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 8126,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 71748342.24677438,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 41027,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 104072391.69696963,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 39921,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 105229869.19898881,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 41321,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 119235728.88463205,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 36137,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 98528581.39858007,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 25273,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 107875193.8020294,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 33716,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 118190660.21103586,
                      },
                    },
                  ],
                },
              },
              {
                key: 'New Jersey Turnpike Authority, New Jersey',
                doc_count: 225339,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 30381,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 264134820.032093,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 28596,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 297889604.11524427,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 28647,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 241068132.79282907,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 31018,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 299407555.91842395,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 42620,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 599975715.0846791,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 32761,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 355788524.62766415,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 31316,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 910935339.3885571,
                      },
                    },
                  ],
                },
              },
              {
                key: 'New Jersey Transit Corporation, New Jersey',
                doc_count: 222116,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 39444,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 192237017.555273,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 37347,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 547726533.716712,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 31260,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 317197371.9950113,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 33936,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 71657927.3380368,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 35010,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 1582389492.104246,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 23444,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 805566383.3537539,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 21675,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 215738841.33533394,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Deptford Township Schools, New Jersey',
                doc_count: 213910,
                columns: {
                  buckets: [
                    {
                      key_as_string: '2015-01-01T00:00:00.000Z',
                      key: 1420070400000,
                      doc_count: 7097,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 71202212.75887999,
                      },
                    },
                    {
                      key_as_string: '2016-01-01T00:00:00.000Z',
                      key: 1451606400000,
                      doc_count: 7862,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 75411780.39082167,
                      },
                    },
                    {
                      key_as_string: '2017-01-01T00:00:00.000Z',
                      key: 1483228800000,
                      doc_count: 46830,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 53578603.00577375,
                      },
                    },
                    {
                      key_as_string: '2018-01-01T00:00:00.000Z',
                      key: 1514764800000,
                      doc_count: 46134,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 25899812.45429396,
                      },
                    },
                    {
                      key_as_string: '2019-01-01T00:00:00.000Z',
                      key: 1546300800000,
                      doc_count: 50154,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 29358423.85031809,
                      },
                    },
                    {
                      key_as_string: '2020-01-01T00:00:00.000Z',
                      key: 1577836800000,
                      doc_count: 52255,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 32333069.809651308,
                      },
                    },
                    {
                      key_as_string: '2021-01-01T00:00:00.000Z',
                      key: 1609459200000,
                      doc_count: 3578,
                      'pivotMetric-sum-LineItem.TotalPrice': {
                        value: 17706362.615578145,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
}
