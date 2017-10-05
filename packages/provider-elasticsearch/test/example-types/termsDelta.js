let sequentialResultTest = require('./testUtils').sequentialResultTest

describe('termsDelta', () => {
  let test = sequentialResultTest([
    {
      aggregations: {
        results: {
          buckets: {
            background: {
              doc_count: 713621,
              field: {
                doc_count_error_upper_bound: 196,
                sum_other_doc_count: 358615,
                buckets: [
                  {
                    key: 'tx',
                    doc_count: 200165,
                  },
                  {
                    key: 'ca',
                    doc_count: 62785,
                  },
                  {
                    key: 'il',
                    doc_count: 33922,
                  },
                  {
                    key: 'fl',
                    doc_count: 32806,
                  },
                  {
                    key: 'wi',
                    doc_count: 25328,
                  },
                ],
              },
            },
            foreground: {
              doc_count: 4466,
              field: {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 2615,
                buckets: [
                  {
                    key: 'tx',
                    doc_count: 700,
                  },
                  {
                    key: 'ca',
                    doc_count: 414,
                  },
                  {
                    key: 'mo',
                    doc_count: 266,
                  },
                  {
                    key: 'fl',
                    doc_count: 242,
                  },
                  {
                    key: 'oh',
                    doc_count: 229,
                  },
                ],
              },
            },
          },
        },
      },
    },
  ])
  let testJSONKey = sequentialResultTest([
    {
      aggregations: {
        results: {
          buckets: {
            background: {
              doc_count: 108792,
              field: {
                doc_count_error_upper_bound: 272,
                sum_other_doc_count: 103881,
                buckets: [
                  {
                    key:
                      '{"state": "Chicago Public Schools, IL", "latlong": "41.88228196464479,-87.62865515425801"}',
                    doc_count: 1501,
                  },
                  {
                    key:
                      '{"state": "University Of Michigan at Ann Arbor, MI", "latlong": "42.280825953930616,-83.74303802847862"}',
                    doc_count: 894,
                  },
                  {
                    key:
                      '{"state": "Mansfield Independent School District, TX", "latlong": "32.57515397854149,-97.14297205209732"}',
                    doc_count: 868,
                  },
                  {
                    key:
                      '{"state": "San Bernardino City Unified School District, CA", "latlong": "34.11313698627055,-117.29579005390406"}',
                    doc_count: 842,
                  },
                  {
                    key:
                      '{"state": "Lamar Consolidated Independent School District, TX", "latlong": "29.55847794190049,-95.78641701489687"}',
                    doc_count: 806,
                  },
                ],
              },
            },
            foreground: {
              doc_count: 4466,
              field: {
                doc_count_error_upper_bound: 32,
                sum_other_doc_count: 4168,
                buckets: [
                  {
                    key:
                      '{"state": "Branson Public Schools, MO", "latlong": "36.68759495951235,-93.21587707847357"}',
                    doc_count: 102,
                  },
                  {
                    key:
                      '{"state": "University of Maryland at College Park, MD", "latlong": "38.989696986973286,-76.9377601146698"}',
                    doc_count: 53,
                  },
                  {
                    key:
                      '{"state": "Clemson University, SC", "latlong": "34.683437990024686,-82.83736500889063"}',
                    doc_count: 52,
                  },
                  {
                    key:
                      '{"state": "City of Hollywood, FL", "latlong": "26.01120094768703,-80.14949016273022"}',
                    doc_count: 47,
                  },
                  {
                    key:
                      '{"state": "Dry Creek Joint Elementary School District, CA", "latlong": "38.7257809471339,-121.33688410744071"}',
                    doc_count: 44,
                  },
                ],
              },
            },
          },
        },
      },
    },
  ])
  it('should work', () =>
    test(
      {
        key: 'widget',
        type: 'termsDelta',
        config: {
          field: 'Organization.State',
          size: 50000,
          aggs: [
            {
              type: 'range',
              field: 'PO.IssuedDate',
              data: {
                gte: 'now-2y-180d',
                lte: 'now-180d',
                format: 'dateOptionalTime',
              },
            },
            {
              type: 'range',
              field: 'PO.IssuedDate',
              data: {
                gte: 'now-180d',
                lte: 'now',
                format: 'dateOptionalTime',
              },
            },
          ],
        },
      },
      {
        results: ['mo', 'oh'],
        totalRecords: 2,
      },
      [
        {
          aggs: {
            results: {
              filters: {
                filters: {
                  background: {
                    range: {
                      'PO.IssuedDate': {
                        gte: 'now-2y-180d',
                        lte: 'now-180d',
                        format: 'dateOptionalTime',
                      },
                    },
                  },
                  foreground: {
                    range: {
                      'PO.IssuedDate': {
                        gte: 'now-180d',
                        lte: 'now',
                        format: 'dateOptionalTime',
                      },
                    },
                  },
                },
              },
              aggs: {
                field: {
                  terms: {
                    field: 'Organization.State.untouched',
                    size: 50000,
                  },
                },
              },
            },
          },
        },
      ]
    ))
  it('should parse JSON keys when using a computed field', () =>
    testJSONKey(
      {
        key: 'widget',
        type: 'termsDelta',
        config: {
          field: 'Organization.NameStateLatLongJson',
          fieldMode: 'word',
          isScript: false,
          isJsonString: true,
          size: 50000,
          aggs: [
            {
              type: 'range',
              field: 'PO.IssuedDate',
              data: {
                gte: 'now-2y-180d',
                lte: 'now-180d',
                format: 'dateOptionalTime',
              },
            },
            {
              type: 'range',
              field: 'PO.IssuedDate',
              data: {
                gte: 'now-180d',
                lte: 'now',
                format: 'dateOptionalTime',
              },
            },
          ],
        },
      },
      {
        results: [
          {
            latlong: '36.68759495951235,-93.21587707847357',
            state: 'Branson Public Schools, MO',
          },
          {
            latlong: '38.989696986973286,-76.9377601146698',
            state: 'University of Maryland at College Park, MD',
          },
          {
            latlong: '34.683437990024686,-82.83736500889063',
            state: 'Clemson University, SC',
          },
          {
            latlong: '26.01120094768703,-80.14949016273022',
            state: 'City of Hollywood, FL',
          },
          {
            latlong: '38.7257809471339,-121.33688410744071',
            state: 'Dry Creek Joint Elementary School District, CA',
          },
        ],
        totalRecords: 5,
      },
      [
        {
          aggs: {
            results: {
              filters: {
                filters: {
                  background: {
                    range: {
                      'PO.IssuedDate': {
                        gte: 'now-2y-180d',
                        lte: 'now-180d',
                        format: 'dateOptionalTime',
                      },
                    },
                  },
                  foreground: {
                    range: {
                      'PO.IssuedDate': {
                        gte: 'now-180d',
                        lte: 'now',
                        format: 'dateOptionalTime',
                      },
                    },
                  },
                },
              },
              aggs: {
                field: {
                  terms: {
                    field: 'Organization.NameStateLatLongJson',
                    size: 50000,
                  },
                },
              },
            },
          },
        },
      ]
    ))
})
