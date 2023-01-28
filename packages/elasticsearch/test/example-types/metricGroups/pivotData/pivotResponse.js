export default {
  took: 7506,
  timed_out: false,
  _shards: {
    total: 80,
    successful: 80,
    skipped: 0,
    failed: 0,
  },
  hits: {
    total: {
      value: 442825686,
      relation: 'gte',
    },
    max_score: null,
    hits: [],
  },
  aggregations: {
    rows: {
      doc_count_error_upper_bound: 11609804,
      sum_other_doc_count: 442825686,
      buckets: [
        {
          key: 'Texas',
          doc_count: 85720456,
          rows: {
            doc_count_error_upper_bound: 566241,
            sum_other_doc_count: 74749378,
            buckets: [
              {
                key: 'UT Southwestern Medical Center, Texas',
                doc_count: 2280465,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 1774855,
                      avg: {
                        value: 123.61877539749409,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 2.1940540160811937e8,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 463268,
                      avg: {
                        value: 1930.249843325976,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.98046875,
                      },
                      sum: {
                        value: 8.942229844179382e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'University of Texas MD Anderson Cancer Center, Texas',
                doc_count: 1272132,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 1072035,
                      avg: {
                        value: 86.85762873285029,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 9.311441801862116e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 183007,
                      avg: {
                        value: 1989.2294442580583,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9998.7998046875,
                      },
                      sum: {
                        value: 3.640429129053345e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Northside Independent School District, Texas',
                doc_count: 1209799,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 1042756,
                      avg: {
                        value: 75.51375318424328,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 7.874241921538879e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 148980,
                      avg: {
                        value: 1846.3102262402977,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 2.7506329750527954e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Texas Health and Human Services Commission, Texas',
                doc_count: 1026638,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 513479,
                      avg: {
                        value: 131.30856062344043,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 6.742418840036356e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 330987,
                      avg: {
                        value: 2717.5309126143698,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.9697265625,
                      },
                      sum: {
                        value: 8.994674041734924e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Houston ISD, Texas',
                doc_count: 1011486,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 845507,
                      avg: {
                        value: 94.4360254182857,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 7.984632054333848e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 136990,
                      avg: {
                        value: 2321.9531331795306,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.9599609375,
                      },
                      sum: {
                        value: 3.180843597142639e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Garland Independent School District, Texas',
                doc_count: 859890,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 792941,
                      avg: {
                        value: 67.07635840236391,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.9998779296875,
                      },
                      sum: {
                        value: 5.318759470792884e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 58425,
                      avg: {
                        value: 1975.002856705959,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.900390625,
                      },
                      sum: {
                        value: 1.1538954190304565e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'City of San Antonio, Texas',
                doc_count: 844879,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 634121,
                      avg: {
                        value: 102.79897065992964,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 6.518698607384524e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 171856,
                      avg: {
                        value: 2159.449021737454,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 3.711142710797119e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Katy Independent School District, Texas',
                doc_count: 835188,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 669591,
                      avg: {
                        value: 105.0490095199639,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.9949951171875,
                      },
                      sum: {
                        value: 7.033987133348215e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 146316,
                      avg: {
                        value: 1898.7888984735448,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 2.778231964690552e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Dallas ISD, Texas',
                doc_count: 831819,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 678166,
                      avg: {
                        value: 83.69106338212019,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 5.6756433689598925e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 124068,
                      avg: {
                        value: 2165.668484449548,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 2.686901575286865e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'McAllen Independent School District (ISD), Texas',
                doc_count: 798782,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 677167,
                      avg: {
                        value: 84.1736909077194,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 5.699964575090762e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 109740,
                      avg: {
                        value: 1819.356430825132,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 1.9965617471875e8,
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
          doc_count: 69508750,
          rows: {
            doc_count_error_upper_bound: 310692,
            sum_other_doc_count: 58439970,
            buckets: [
              {
                key: 'Ohio State University, Ohio',
                doc_count: 4952263,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 4024309,
                      avg: {
                        value: 96.12894216963802,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 3.8685256713375384e8,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 644351,
                      avg: {
                        value: 1802.1472297222226,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 1.161215369618744e9,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Greene County Court of Commons Pleas, Ohio',
                doc_count: 1078624,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 864306,
                      avg: {
                        value: 101.28828428425045,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 8.754407183658338e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 179714,
                      avg: {
                        value: 1426.013434972438,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9998.0,
                      },
                      sum: {
                        value: 2.5627457845263672e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Lakota Local School District, Ohio',
                doc_count: 778589,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 541745,
                      avg: {
                        value: 99.09044784094684,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 5.368175466559374e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 212158,
                      avg: {
                        value: 2199.993344519232,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9997.2099609375,
                      },
                      sum: {
                        value: 4.6674618798651123e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Westerville City School District, Ohio',
                doc_count: 765253,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 597879,
                      avg: {
                        value: 77.50898509673662,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 4.63409945006518e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 127223,
                      avg: {
                        value: 1821.7162662177266,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.0,
                      },
                      sum: {
                        value: 2.3176420853701782e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Greene County, Ohio',
                doc_count: 758371,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 654095,
                      avg: {
                        value: 95.63703516990955,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 6.255570651946199e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 83642,
                      avg: {
                        value: 1676.6821116520443,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9998.0,
                      },
                      sum: {
                        value: 1.402410451828003e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'City of Columbus, Ohio',
                doc_count: 596072,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 469216,
                      avg: {
                        value: 98.10212238116729,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 4.603108545520179e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 101891,
                      avg: {
                        value: 2113.829190270769,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.5,
                      },
                      sum: {
                        value: 2.153801700258789e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Dayton City School District, Ohio',
                doc_count: 594213,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 419671,
                      avg: {
                        value: 96.53111200438717,
                      },
                      min: {
                        value: 0.009999999776482582,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 4.051130830599317e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 152180,
                      avg: {
                        value: 2190.457076336523,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9998.9599609375,
                      },
                      sum: {
                        value: 3.333437578768921e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Sylvania City School District, Ohio',
                doc_count: 536559,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 361768,
                      avg: {
                        value: 97.65095724806412,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 3.532699150171766e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 163971,
                      avg: {
                        value: 2282.373560976454,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.9404296875,
                      },
                      sum: {
                        value: 3.742430751668701e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Stark County, Ohio',
                doc_count: 527452,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 393082,
                      avg: {
                        value: 133.76071565068662,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 5.25789296294032e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 110665,
                      avg: {
                        value: 2078.3208632123306,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.9501953125,
                      },
                      sum: {
                        value: 2.2999737832739258e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Cleveland Metropolitan School District, Ohio',
                doc_count: 481384,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 408633,
                      avg: {
                        value: 85.55052781142933,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 3.49587688311678e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 61953,
                      avg: {
                        value: 1798.7312521778497,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.740234375,
                      },
                      sum: {
                        value: 1.1143679726617432e8,
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
          doc_count: 64124722,
          rows: {
            doc_count_error_upper_bound: 239292,
            sum_other_doc_count: 39367553,
            buckets: [
              {
                key: 'County of Los Angeles, California',
                doc_count: 10888355,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 9952999,
                      avg: {
                        value: 49.37671074545828,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 4.914463526728355e8,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 854371,
                      avg: {
                        value: 1895.4533230570178,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 1.6194203510735474e9,
                      },
                    },
                  ],
                },
              },
              {
                key: 'County of Santa Clara, California',
                doc_count: 3414238,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 3108996,
                      avg: {
                        value: 55.979818527616274,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 1.740410318830849e8,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 283984,
                      avg: {
                        value: 1804.7794265313996,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.7998046875,
                      },
                      sum: {
                        value: 5.12528480664093e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'City of Los Angeles, California',
                doc_count: 2878536,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 2096761,
                      avg: {
                        value: 101.85652513064466,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 2.135687894894556e8,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 610085,
                      avg: {
                        value: 2240.473931768515,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 1.3668795386629944e9,
                      },
                    },
                  ],
                },
              },
              {
                key: 'El Camino Hospital, California',
                doc_count: 1781902,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 1537311,
                      avg: {
                        value: 66.32493160241017,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 1.0196204692663279e8,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 216099,
                      avg: {
                        value: 1907.9794244219227,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.419921875,
                      },
                      sum: {
                        value: 4.123124456381531e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Kaweah Delta Health Care District, California',
                doc_count: 1601346,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 1473844,
                      avg: {
                        value: 53.94952151187243,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.9800109863281,
                      },
                      sum: {
                        value: 7.951317858314411e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 113431,
                      avg: {
                        value: 1647.6329591076496,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.0,
                      },
                      sum: {
                        value: 1.868926541845398e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Los Angeles Unified School District, California',
                doc_count: 1574797,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 1193822,
                      avg: {
                        value: 104.10540554181716,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 1.2428332345474325e8,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 329798,
                      avg: {
                        value: 2204.2385651349687,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 7.269534703043823e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Port of Los Angeles, California',
                doc_count: 776067,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 573874,
                      avg: {
                        value: 85.24906203327993,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 4.8922220225286484e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 132490,
                      avg: {
                        value: 2201.6069292910224,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.599609375,
                      },
                      sum: {
                        value: 2.916909020617676e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'University of California - Santa Barbara, California',
                doc_count: 746695,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 645259,
                      avg: {
                        value: 89.78847013463677,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 5.7936818450605586e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 90621,
                      avg: {
                        value: 1973.117077182294,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.9501953125,
                      },
                      sum: {
                        value: 1.7880584265133667e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'California Department of Corrections and Rehabilitation, California',
                doc_count: 583087,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 328441,
                      avg: {
                        value: 125.37490288100605,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 4.117825847714051e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 202122,
                      avg: {
                        value: 2852.5289913466668,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 5.76558864788971e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'San Diego Unified School District, California',
                doc_count: 512146,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 447235,
                      avg: {
                        value: 76.43218532784252,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 3.418314840509765e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 50483,
                      avg: {
                        value: 2144.7824043543083,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.0,
                      },
                      sum: {
                        value: 1.0827505011901855e8,
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
          doc_count: 44472457,
          rows: {
            doc_count_error_upper_bound: 119005,
            sum_other_doc_count: 10007149,
            buckets: [
              {
                key: 'Department of Defense: Defense Logistics Agency, Virginia',
                doc_count: 20473438,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 10182136,
                      avg: {
                        value: 171.79137780580166,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 1.7492031724460542e9,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 7582220,
                      avg: {
                        value: 2502.306178918436,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 1.8973035955918945e10,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Department of Defense: Defense Logistics Agency - Central, Virginia',
                doc_count: 5141775,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 2367920,
                      avg: {
                        value: 121.00370079676686,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 2.865270831906802e8,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 2047812,
                      avg: {
                        value: 2899.3901964197275,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 5.937406036910675e9,
                      },
                    },
                  ],
                },
              },
              {
                key: 'City of Richmond, Virginia',
                doc_count: 2728830,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 1670229,
                      avg: {
                        value: 122.73385886373184,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 2.0499365035611197e8,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 786294,
                      avg: {
                        value: 1893.5495773791768,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.98046875,
                      },
                      sum: {
                        value: 1.4888866713957825e9,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Defense Contract Management Agency (DCMA) - DLA, Virginia',
                doc_count: 2435845,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 1608471,
                      avg: {
                        value: 90.44781430772358,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 1.4548268632735845e8,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 651840,
                      avg: {
                        value: 2594.2247204047417,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 1.6910194417486267e9,
                      },
                    },
                  ],
                },
              },
              {
                key: 'University of Virginia, Virginia',
                doc_count: 1221571,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 1024529,
                      avg: {
                        value: 98.87787737179978,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.99951171875,
                      },
                      sum: {
                        value: 1.0130325282585266e8,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 169270,
                      avg: {
                        value: 2079.809655490383,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 3.520493803848572e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Virginia Polytechnic Institute And State University, Virginia',
                doc_count: 702118,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 601315,
                      avg: {
                        value: 94.59168666354911,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 5.687940006609204e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 93420,
                      avg: {
                        value: 1895.2992765328227,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 1.770588584136963e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Fairfax County Schools, Virginia',
                doc_count: 567798,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 513159,
                      avg: {
                        value: 46.60535749230847,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 2.391595864539552e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 44812,
                      avg: {
                        value: 2283.4322600749033,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.0,
                      },
                      sum: {
                        value: 1.0232516643847656e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Virginia Commonwealth University, Virginia',
                doc_count: 462921,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 372877,
                      avg: {
                        value: 100.88515713471128,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 3.761775473691974e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 77312,
                      avg: {
                        value: 2185.3082387530253,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 1.6895055055447388e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Chesterfield County, Virginia',
                doc_count: 379948,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 283560,
                      avg: {
                        value: 110.22622484721815,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 3.1255748317677177e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 81715,
                      avg: {
                        value: 2138.188421190919,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 1.7472206683761597e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Virginia Department of Transportation, Virginia',
                doc_count: 351064,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 141901,
                      avg: {
                        value: 119.14954960504478,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 1.690744023850546e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 130790,
                      avg: {
                        value: 3192.559504251125,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 4.1755485756100464e8,
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
          doc_count: 39288383,
          rows: {
            doc_count_error_upper_bound: 170147,
            sum_other_doc_count: 29196807,
            buckets: [
              {
                key: 'City of New York, New York',
                doc_count: 1713517,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 891200,
                      avg: {
                        value: 151.27377531309892,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 1.3481518855903375e8,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 609213,
                      avg: {
                        value: 2419.793556983453,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 1.4741696922305603e9,
                      },
                    },
                  ],
                },
              },
              {
                key: 'New York City Department of Finance, New York',
                doc_count: 1690325,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 867568,
                      avg: {
                        value: 166.19546220501482,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 1.441858647542803e8,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 608517,
                      avg: {
                        value: 2304.613947886691,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 1.4023967657261658e9,
                      },
                    },
                  ],
                },
              },
              {
                key: 'New York City Council, New York',
                doc_count: 1678148,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 867763,
                      avg: {
                        value: 167.49972007766945,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 1.4535005959375867e8,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 602595,
                      avg: {
                        value: 2296.9840669913174,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 1.3841511138486328e9,
                      },
                    },
                  ],
                },
              },
              {
                key: 'State University of New York SUNY Buffalo, New York',
                doc_count: 1676457,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 951269,
                      avg: {
                        value: 151.31078924824524,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 1.43937263177389e8,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 617755,
                      avg: {
                        value: 2258.40605450447,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 1.395141632200409e9,
                      },
                    },
                  ],
                },
              },
              {
                key: 'SUNY Upstate Medical University, New York',
                doc_count: 835746,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 511127,
                      avg: {
                        value: 171.7412767873471,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 8.778160358048636e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 307939,
                      avg: {
                        value: 1857.4878260762773,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.98046875,
                      },
                      sum: {
                        value: 5.719929436741028e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'New York City School Construction Authority, New York',
                doc_count: 644906,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 282470,
                      avg: {
                        value: 168.7876983373021,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 4.7677461149337724e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 251199,
                      avg: {
                        value: 2636.5782444483657,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.7998046875,
                      },
                      sum: {
                        value: 6.62305818427185e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'New York City Department of Education, New York',
                doc_count: 644795,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 537383,
                      avg: {
                        value: 86.28100649812971,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 4.636594611498444e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 97791,
                      avg: {
                        value: 1941.6583487946243,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.9404296875,
                      },
                      sum: {
                        value: 1.898767115869751e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'NYC Department of Environmental Protection, New York',
                doc_count: 433782,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 171003,
                      avg: {
                        value: 121.13243385578885,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 2.071400958664146e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 148716,
                      avg: {
                        value: 3411.8113109748992,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.98046875,
                      },
                      sum: {
                        value: 5.073909309229431e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'New York City Transit Authority, New York',
                doc_count: 407118,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 99041,
                      avg: {
                        value: 155.66052376541063,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.95001220703125,
                      },
                      sum: {
                        value: 1.5416773934250034e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 237386,
                      avg: {
                        value: 3412.4656715561155,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.98046875,
                      },
                      sum: {
                        value: 8.1007157590802e8,
                      },
                    },
                  ],
                },
              },
              {
                key: "New York City Comptroller's Office, New York",
                doc_count: 366782,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 111175,
                      avg: {
                        value: 190.37500411534748,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 2.1164941082523756e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 171945,
                      avg: {
                        value: 2570.3010046849245,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 4.419504062505493e8,
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
          doc_count: 39206506,
          rows: {
            doc_count_error_upper_bound: 264500,
            sum_other_doc_count: 24714887,
            buckets: [
              {
                key: 'Jackson Health System, Florida',
                doc_count: 7633238,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 7348606,
                      avg: {
                        value: 31.11481715643219,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 2.286505320446605e8,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 270077,
                      avg: {
                        value: 1861.7806497860854,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 5.028241325522766e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'University of Florida, Florida',
                doc_count: 1350903,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 1127711,
                      avg: {
                        value: 93.57920919936056,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 1.055303035854201e8,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 185933,
                      avg: {
                        value: 2288.15980682863,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 4.254444173630676e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Broward County Public Schools, Florida',
                doc_count: 1158074,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 975433,
                      avg: {
                        value: 76.4790188915747,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 7.460015883446538e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 159594,
                      avg: {
                        value: 2164.361459590911,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 3.454191027819519e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Florida Department of Health, Florida',
                doc_count: 821457,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 650992,
                      avg: {
                        value: 93.99304458855616,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.99951171875,
                      },
                      sum: {
                        value: 6.1188720082793355e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 144656,
                      avg: {
                        value: 2079.1057301702626,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 3.007551185035095e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'City of Milton, Florida',
                doc_count: 732396,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 658999,
                      avg: {
                        value: 69.6072455766622,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 4.5871105227774814e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 47403,
                      avg: {
                        value: 1618.7311068669383,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9998.7802734375,
                      },
                      sum: {
                        value: 7.673271065881348e7,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Halifax Medical Center, Florida',
                doc_count: 623926,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 500990,
                      avg: {
                        value: 116.94178656977306,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 5.8586665653590605e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 106525,
                      avg: {
                        value: 1762.1119504945152,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9996.9599609375,
                      },
                      sum: {
                        value: 1.8770897552642822e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Nassau County School District, Florida',
                doc_count: 567478,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 371582,
                      avg: {
                        value: 72.9174255472222,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 2.7094802819687918e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 159389,
                      avg: {
                        value: 2419.909727688343,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.9404296875,
                      },
                      sum: {
                        value: 3.8570699158651733e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Okeechobee County Schools, Florida',
                doc_count: 550406,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 369938,
                      avg: {
                        value: 93.88212874504416,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 3.4730566943684146e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 139872,
                      avg: {
                        value: 2313.8169230048975,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9998.900390625,
                      },
                      sum: {
                        value: 3.23638200654541e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Hillsborough County Public School Board, Florida',
                doc_count: 529912,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 377448,
                      avg: {
                        value: 114.29522580404439,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 4.3140504389284946e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 128967,
                      avg: {
                        value: 2086.3415971076392,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 2.690692167541809e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Florida Department of Corrections, Florida',
                doc_count: 523829,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 414444,
                      avg: {
                        value: 105.53274636412722,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.99951171875,
                      },
                      sum: {
                        value: 4.373741353413434e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 98039,
                      avg: {
                        value: 1825.241713424012,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.900390625,
                      },
                      sum: {
                        value: 1.789448723423767e8,
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
          doc_count: 37538822,
          rows: {
            doc_count_error_upper_bound: 111550,
            sum_other_doc_count: 31185933,
            buckets: [
              {
                key: 'Chicago Public Schools, Illinois',
                doc_count: 2526461,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 2036756,
                      avg: {
                        value: 84.54494606360892,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.9966735839844,
                      },
                      sum: {
                        value: 1.7219742616473186e8,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 394367,
                      avg: {
                        value: 2203.487856130565,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 8.689828953586426e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'University of Illinois at Chicago, Urbana-Champaign, and Springfield, Illinois',
                doc_count: 826448,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 586178,
                      avg: {
                        value: 152.2349443834371,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 8.92367752287944e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 210836,
                      avg: {
                        value: 2100.750680424343,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 4.429138704579468e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Illinois State Department Of Transportation, Illinois',
                doc_count: 792432,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 454008,
                      avg: {
                        value: 131.6783010065833,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 5.978300208339687e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 213370,
                      avg: {
                        value: 2595.9965702461473,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 5.539077881934204e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Cook County, Illinois',
                doc_count: 715188,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 549083,
                      avg: {
                        value: 100.65048093558165,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 5.5265468023551986e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 146696,
                      avg: {
                        value: 1841.079153409888,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.26953125,
                      },
                      sum: {
                        value: 2.7007894748861694e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Metra Commuter Rail Board, Illinois',
                doc_count: 346144,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 232626,
                      avg: {
                        value: 136.41715098196477,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 3.1734176164330535e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 93083,
                      avg: {
                        value: 2156.737339333736,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.998046875,
                      },
                      sum: {
                        value: 2.0075558175720215e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Rockford School District No. 205, Illinois',
                doc_count: 293504,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 249279,
                      avg: {
                        value: 68.16025661122549,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 1.699092060778968e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 36108,
                      avg: {
                        value: 2259.5453293735804,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.76953125,
                      },
                      sum: {
                        value: 8.158766275302124e7,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Kane County Community Unit School District No. 300, Illinois',
                doc_count: 280988,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 259080,
                      avg: {
                        value: 59.71647302919394,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 1.5471343832403567e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 18320,
                      avg: {
                        value: 1712.5882846149295,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9984.0,
                      },
                      sum: {
                        value: 3.1374617374145508e7,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Illinois Department of Corrections, Illinois',
                doc_count: 230931,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 142335,
                      avg: {
                        value: 122.88987536280149,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.95001220703125,
                      },
                      sum: {
                        value: 1.749153040976435e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 72881,
                      avg: {
                        value: 2516.03118470425,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.25,
                      },
                      sum: {
                        value: 1.8337086877243042e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Cicero Public School District No. 99, Illinois',
                doc_count: 179302,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 147015,
                      avg: {
                        value: 70.25725954269595,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 1.0328871011669444e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 25154,
                      avg: {
                        value: 2391.219069147334,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9998.0,
                      },
                      sum: {
                        value: 6.014872446533203e7,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Winnebago County, Illinois',
                doc_count: 161491,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 118345,
                      avg: {
                        value: 134.89069283208795,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 1.596363904321345e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 36547,
                      avg: {
                        value: 2203.440411547465,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.900390625,
                      },
                      sum: {
                        value: 8.05291367208252e7,
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
          doc_count: 30984705,
          rows: {
            doc_count_error_upper_bound: 87337,
            sum_other_doc_count: 14320143,
            buckets: [
              {
                key: 'University of Michigan at Ann Arbor, Michigan',
                doc_count: 13615474,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 12387935,
                      avg: {
                        value: 62.9586254726275,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 7.799273600442538e8,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 1128705,
                      avg: {
                        value: 1857.21650852591,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 2.0962495592557373e9,
                      },
                    },
                  ],
                },
              },
              {
                key: 'County of Macomb, Michigan',
                doc_count: 801980,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 573130,
                      avg: {
                        value: 106.94703190699512,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 6.1294552396856114e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 183726,
                      avg: {
                        value: 2487.2203728624027,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9998.0302734375,
                      },
                      sum: {
                        value: 4.569670502245178e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Michigan State University, Michigan',
                doc_count: 745099,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 574866,
                      avg: {
                        value: 103.65920319982821,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 5.959015150667244e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 148364,
                      avg: {
                        value: 2304.768763675028,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 3.4194471285388184e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Wayne State University, Michigan',
                doc_count: 380636,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 301219,
                      avg: {
                        value: 103.19231014313696,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 3.1083484469005574e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 67870,
                      avg: {
                        value: 2151.460383896654,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.9599609375,
                      },
                      sum: {
                        value: 1.4601961625506592e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'City of Detroit, Michigan',
                doc_count: 252994,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 171032,
                      avg: {
                        value: 103.38312416339818,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 1.7681822491914317e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 60296,
                      avg: {
                        value: 2467.5474642257213,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 1.487832419029541e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Michigan State Department Of Corrections, Michigan',
                doc_count: 210364,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 110888,
                      avg: {
                        value: 145.74684111237033,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 1.6161575717268521e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 78600,
                      avg: {
                        value: 2651.7393105186093,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.9404296875,
                      },
                      sum: {
                        value: 2.084267098067627e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'City of Kalamazoo, Michigan',
                doc_count: 195170,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 151105,
                      avg: {
                        value: 96.34146575773823,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 1.4557677183323035e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 34082,
                      avg: {
                        value: 2183.879753987167,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9998.5,
                      },
                      sum: {
                        value: 7.443098977539062e5,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Washtenaw County, Michigan',
                doc_count: 177396,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 119190,
                      avg: {
                        value: 135.15332763855133,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 1.6108925121238932e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 45957,
                      avg: {
                        value: 2280.3913872681023,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.599609375,
                      },
                      sum: {
                        value: 1.0479994698468018e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Michigan State Department Of Health & Human Services, Michigan',
                doc_count: 149338,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 72819,
                      avg: {
                        value: 181.34634477594045,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.9599914550781,
                      },
                      sum: {
                        value: 1.3205459480239207e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 61831,
                      avg: {
                        value: 2782.1835486357495,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.5,
                      },
                      sum: {
                        value: 1.7202519099569702e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Michigan State Department Of Natural Resources, Michigan',
                doc_count: 136111,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 98144,
                      avg: {
                        value: 133.38115866517964,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.9700012207031,
                      },
                      sum: {
                        value: 1.3090560436035391e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 32330,
                      avg: {
                        value: 2167.7219848915993,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.0498046875,
                      },
                      sum: {
                        value: 7.008245177154541e7,
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
          doc_count: 29082460,
          rows: {
            doc_count_error_upper_bound: 138157,
            sum_other_doc_count: 26528043,
            buckets: [
              {
                key: 'Newark Public Schools, New Jersey',
                doc_count: 349082,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 280892,
                      avg: {
                        value: 84.31429782351324,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 2.368321174424228e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 52184,
                      avg: {
                        value: 2004.9508570042854,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.900390625,
                      },
                      sum: {
                        value: 1.0462635552191162e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Monmouth County, New Jersey',
                doc_count: 303493,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 106483,
                      avg: {
                        value: 168.62119123529277,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 1.795529030630768e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 175391,
                      avg: {
                        value: 1492.4998120038124,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 2.6177103452716064e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'County of Morris, New Jersey',
                doc_count: 290330,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 148235,
                      avg: {
                        value: 154.49699466964358,
                      },
                      min: {
                        value: 0.009999999776482582,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 2.2901862004854616e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 109605,
                      avg: {
                        value: 2274.2926646147203,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 2.4927384750509644e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Hudson County, New Jersey',
                doc_count: 272180,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 176938,
                      avg: {
                        value: 120.17711532790757,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 2.126389843188931e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 63971,
                      avg: {
                        value: 2298.413549821766,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.0,
                      },
                      sum: {
                        value: 1.470318131956482e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Hackensack Public Schools, New Jersey',
                doc_count: 267957,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 254721,
                      avg: {
                        value: 16.69257488132412,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 4251949.366345761,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 9179,
                      avg: {
                        value: 2267.1548891334523,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9997.5,
                      },
                      sum: {
                        value: 2.0810214727355957e7,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Brick Township Public Schools, New Jersey',
                doc_count: 248415,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 218999,
                      avg: {
                        value: 50.87927027755257,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 1.1142509311513735e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 21436,
                      avg: {
                        value: 2188.1791427592375,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9996.4501953125,
                      },
                      sum: {
                        value: 4.690580810418701e7,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Deptford Township Schools, New Jersey',
                doc_count: 213910,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 196811,
                      avg: {
                        value: 19.132552144513713,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 3765496.7201138884,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 11398,
                      avg: {
                        value: 2264.986324432796,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.0,
                      },
                      sum: {
                        value: 2.581631412588501e7,
                      },
                    },
                  ],
                },
              },
              {
                key: 'New Jersey Turnpike Authority, New Jersey',
                doc_count: 210273,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 162700,
                      avg: {
                        value: 103.32969410651968,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.9800109863281,
                      },
                      sum: {
                        value: 1.6811741231130753e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 34749,
                      avg: {
                        value: 2098.4561993520088,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.900390625,
                      },
                      sum: {
                        value: 7.291925447128296e7,
                      },
                    },
                  ],
                },
              },
              {
                key: 'New Jersey Transit Corporation, New Jersey',
                doc_count: 203853,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 133931,
                      avg: {
                        value: 100.90801567196017,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 1.3514711446961299e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 54929,
                      avg: {
                        value: 2508.299449052071,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.0,
                      },
                      sum: {
                        value: 1.377783804369812e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Rowan University, New Jersey',
                doc_count: 194924,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 134799,
                      avg: {
                        value: 123.80030805511079,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 1.6688157725520879e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 51704,
                      avg: {
                        value: 2141.4564675259253,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.0,
                      },
                      sum: {
                        value: 1.1072186519696045e8,
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
          doc_count: 27410983,
          rows: {
            doc_count_error_upper_bound: 149568,
            sum_other_doc_count: 21288180,
            buckets: [
              {
                key: 'University of Washington Medical Center, Washington',
                doc_count: 1655206,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 1503509,
                      avg: {
                        value: 53.06701181146745,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 7.978672986164762e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 128703,
                      avg: {
                        value: 1857.9168122925857,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 2.3911946749249268e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'University of Washington, Washington',
                doc_count: 1177600,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 1087148,
                      avg: {
                        value: 48.78629925656903,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.9949951171875,
                      },
                      sum: {
                        value: 5.303792766418051e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 59649,
                      avg: {
                        value: 2048.003576759001,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.9970703125,
                      },
                      sum: {
                        value: 1.2216136535009766e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'King County, Washington',
                doc_count: 992466,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 648973,
                      avg: {
                        value: 121.4508032130144,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 7.881829211355959e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 258177,
                      avg: {
                        value: 2590.052246664321,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.9990234375,
                      },
                      sum: {
                        value: 6.686919188870544e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Mukilteo School District, Washington',
                doc_count: 565947,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 293836,
                      avg: {
                        value: 107.53930297322714,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 3.159891862844117e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 128231,
                      avg: {
                        value: 2389.991247327697,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.08984375,
                      },
                      sum: {
                        value: 3.064709676360779e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'City of Tacoma, Washington',
                doc_count: 381463,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 249375,
                      avg: {
                        value: 93.74144025584417,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 2.337677166380114e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 64357,
                      avg: {
                        value: 2307.4543579107253,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9998.33984375,
                      },
                      sum: {
                        value: 1.4850084011206055e8,
                      },
                    },
                  ],
                },
              },
              {
                key: 'City of Omak, Washington',
                doc_count: 306668,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 279749,
                      avg: {
                        value: 38.43037722729225,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.9700012207031,
                      },
                      sum: {
                        value: 1.0750859598957779e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 15785,
                      avg: {
                        value: 2101.399448431267,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9984.2900390625,
                      },
                      sum: {
                        value: 3.317059029348755e7,
                      },
                    },
                  ],
                },
              },
              {
                key: 'City of Selah, Washington',
                doc_count: 288571,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 255139,
                      avg: {
                        value: 65.87060578083229,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 1.680616048831577e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 27973,
                      avg: {
                        value: 1958.3721513221437,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9998.08984375,
                      },
                      sum: {
                        value: 5.4781544188934326e7,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Pasco School District, Washington',
                doc_count: 268552,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 220016,
                      avg: {
                        value: 95.84473707833959,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 2.1087375673027962e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 35362,
                      avg: {
                        value: 1771.1696500258777,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9995.009765625,
                      },
                      sum: {
                        value: 6.263210116421509e7,
                      },
                    },
                  ],
                },
              },
              {
                key: 'Seattle School District 1, Washington',
                doc_count: 251026,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 199089,
                      avg: {
                        value: 100.9866742849679,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.989990234375,
                      },
                      sum: {
                        value: 2.0105335996719975e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 46605,
                      avg: {
                        value: 1921.091276594984,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9996.919921875,
                      },
                      sum: {
                        value: 8.953245894570923e7,
                      },
                    },
                  ],
                },
              },
              {
                key: 'City of Seattle, Washington',
                doc_count: 235304,
                rows: {
                  buckets: [
                    {
                      key: '0.0-500.0',
                      from: 0.0,
                      to: 500.0,
                      doc_count: 125577,
                      avg: {
                        value: 105.52810070815707,
                      },
                      min: {
                        value: 0.0,
                      },
                      max: {
                        value: 499.9599914550781,
                      },
                      sum: {
                        value: 1.325190230262824e7,
                      },
                    },
                    {
                      key: '500.0-10000.0',
                      from: 500.0,
                      to: 10000.0,
                      doc_count: 69990,
                      avg: {
                        value: 2783.364279841055,
                      },
                      min: {
                        value: 500.0,
                      },
                      max: {
                        value: 9999.990234375,
                      },
                      sum: {
                        value: 1.9480766594607544e8,
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
