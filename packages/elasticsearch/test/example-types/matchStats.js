const sequentialResultTest = require('./testUtils').sequentialResultTest

describe('matchStats', () => {
  let test = (...x) =>
    sequentialResultTest(
      [
        {
          aggregations: {
            twoLevelAgg: {
              buckets: {
                pass: {
                  doc_count: 50,
                  twoLevelAgg: {
                    count: 6,
                    min: 60,
                    max: 98,
                    avg: 78.5,
                    sum: 471
                  }
                },
                fail: {
                  doc_count: 50,
                  twoLevelAgg: {
                    count: 6,
                    min: 60,
                    max: 98,
                    avg: 78.5,
                    sum: 471
                  }
                }
              }
            }
          }
        }
      ],
      ...x
    )
  it('should work', () =>
    test(
      {
        key: 'test',
        type: 'matchStats',
        config: {
          key_field: 'Vendor.City.untouched',
          key_value: 'Washington',
          value_field: 'LineItem.TotalPrice'
        }
      },
      {
        results: [
          {
            key: 'pass',
            doc_count: 50,
            count: 6,
            min: 60,
            max: 98,
            avg: 78.5,
            sum: 471
          },
          {
            key: 'fail',
            doc_count: 50,
            count: 6,
            min: 60,
            max: 98,
            avg: 78.5,
            sum: 471
          }
        ]
      },
      [
        {
          aggs: {
            twoLevelAgg: {
              filters: {
                filters: {
                  pass: {
                    term: {
                      'Vendor.City.untouched': 'Washington'
                    }
                  },
                  fail: {
                    bool: {
                      must_not: {
                        term: {
                          'Vendor.City.untouched': 'Washington'
                        }
                      }
                    }
                  }
                }
              },
              aggs: {
                twoLevelAgg: {
                  stats: {
                    field: 'LineItem.TotalPrice'
                  }
                }
              }
            }
          }
        }
      ]
    ))
})
