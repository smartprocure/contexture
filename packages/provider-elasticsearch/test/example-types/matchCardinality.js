const sequentialResultTest = require('./testUtils').sequentialResultTest

describe('matchCardinality', () => {
  const test = (...x) =>
    sequentialResultTest(
      [
        {
          aggregations: {
            twoLevelAgg: {
              buckets: {
                pass: {
                  doc_count: 50,
                  twoLevelAgg: {
                    value: 471
                  }
                },
                fail: {
                  doc_count: 50,
                  twoLevelAgg: {
                    value: 471
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
        type: 'matchCardinality',
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
            value: 471
          },
          {
            key: 'fail',
            doc_count: 50,
            value: 471
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
                  cardinality: {
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
