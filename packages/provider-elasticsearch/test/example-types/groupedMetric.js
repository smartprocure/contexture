const groupedMetric = require('../../src/example-types/groupedMetric'),
  utils = require('./testUtils')

describe('groupedMetric', () => {
  describe('validContext', () => {
    it('should validate a context with config metric type value_count|top_hits, or an existing metric.field', () => {
      utils.validContexts(groupedMetric)([
        {
          config: {
            metric: {
              type: 'value_count'
            }
          }
        },
        {
          config: {
            metric: {
              type: 'top_hits'
            }
          }
        },
        {
          config: {
            metric: {
              type: 'value_count',
              field: 'of study'
            }
          }
        },
        {
          config: {
            metric: {
              type: 'top_hits',
              field: true
            }
          }
        }
      ])
    })
    it('should not validate a context with an invalid config metric type (even if the metric field is non-negative)', () => {
      utils.noValidContexts(groupedMetric)([
        {
          config: {
            metric: {
              type: 'invalid'
            }
          }
        }
      ])
    })
  })

  describe('result', () => {
    const callsArguments = [
      {
        aggs: {
          child: {
            terms: {
              field: 'Organization.NameState.untouched',
              size: 10
            },
            aggs: {
              child: {
                aggs: {
                  child: {
                    sum: {
                      field: 'PO.IssuedAmount'
                    }
                  }
                },
                date_histogram: {
                  field: 'PO.IssuedDate',
                  interval: 'month'
                }
              }
            }
          }
        }
      }
    ]

    it('works for stub config values and gets the expected structure', () =>
      utils.sequentialResultTest(
        [
          {
            aggregations: {
              child: {
                buckets: [
                  {
                    child: {
                      buckets: [
                        {
                          child: {
                            value: 22502.820095062256
                          },
                          doc_count: 85,
                          key: 1199145600000,
                          key_as_string: '2008-01-01T00:00:00.000Z'
                        },
                        {
                          child: {
                            value: 35376.54993534088
                          },
                          doc_count: 102,
                          key: 1201824000000,
                          key_as_string: '2008-02-01T00:00:00.000Z'
                        }
                      ]
                    }
                  },
                  {
                    child: {
                      buckets: [
                        {
                          child: {
                            value: 22494.64009475708
                          },
                          doc_count: 84,
                          key: 1199145600000,
                          key_as_string: '2008-01-01T00:00:00.000Z'
                        },
                        {
                          child: {
                            value: 35317.47993373871
                          },
                          doc_count: 100,
                          key: 1201824000000,
                          key_as_string: '2008-02-01T00:00:00.000Z'
                        }
                      ]
                    }
                  }
                ]
              }
            },
            hits: {
              hits: [],
              max_score: 0,
              total: 276276
            },
            timed_out: false,
            took: 17
          }
        ],
        {
          key: 'test-groupedMetric',
          type: 'groupedMetric',
          config: {
            metric: {
              type: 'sum',
              field: 'PO.IssuedAmount'
            },
            aggs: [
              {
                type: 'terms',
                field: 'Organization.NameState.untouched',
                data: {
                  size: 10
                }
              },
              {
                type: 'date_histogram',
                field: 'PO.IssuedDate',
                data: {
                  interval: 'month'
                }
              }
            ]
          }
        },
        {
          results: {
            child: {
              buckets: [
                {
                  child: {
                    buckets: [
                      {
                        child: {
                          value: 22502.820095062256
                        },
                        doc_count: 85,
                        key: 1199145600000,
                        key_as_string: '2008-01-01T00:00:00.000Z'
                      },
                      {
                        child: {
                          value: 35376.54993534088
                        },
                        doc_count: 102,
                        key: 1201824000000,
                        key_as_string: '2008-02-01T00:00:00.000Z'
                      }
                    ]
                  }
                },
                {
                  child: {
                    buckets: [
                      {
                        child: {
                          value: 22494.64009475708
                        },
                        doc_count: 84,
                        key: 1199145600000,
                        key_as_string: '2008-01-01T00:00:00.000Z'
                      },
                      {
                        child: {
                          value: 35317.47993373871
                        },
                        doc_count: 100,
                        key: 1201824000000,
                        key_as_string: '2008-02-01T00:00:00.000Z'
                      }
                    ]
                  }
                }
              ]
            }
          }
        },
        callsArguments
      ))
  })
})
