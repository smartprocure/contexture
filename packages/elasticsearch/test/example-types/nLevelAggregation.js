const sequentialResultTest = require('./testUtils').sequentialResultTest

describe('nLevelAggregation', () => {
  let test = sequentialResultTest([
    {
      aggregations: {
        terms: {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 0,
          buckets: [
            {
              key: 'California State University-Fresno, CA',
              doc_count: 1574,
              terms: {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 0,
                buckets: [
                  {
                    key: '4.0',
                    doc_count: 892,
                    sum: {
                      value: 488363940.0390625
                    }
                  },
                  {
                    key: '3.0',
                    doc_count: 616,
                    sum: {
                      value: 62682913.21875
                    }
                  },
                  {
                    key: '2.0',
                    doc_count: 66,
                    sum: {
                      value: 6337980
                    }
                  }
                ]
              }
            },
            {
              key: 'University Of Michigan at Ann Arbor, MI',
              doc_count: 1299,
              terms: {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 140,
                buckets: [
                  {
                    key: '10.0',
                    doc_count: 206,
                    sum: {
                      value: 4494826.968653679
                    }
                  },
                  {
                    key: '11.0',
                    doc_count: 125,
                    sum: {
                      value: 2480435.41474247
                    }
                  },
                  {
                    key: '8.0',
                    doc_count: 144,
                    sum: {
                      value: 2060078.2864041328
                    }
                  },
                  {
                    key: '4.0',
                    doc_count: 134,
                    sum: {
                      value: 1708329.3825302124
                    }
                  },
                  {
                    key: '9.0',
                    doc_count: 99,
                    sum: {
                      value: 1000498.0503225327
                    }
                  },
                  {
                    key: '0.0',
                    doc_count: 111,
                    sum: {
                      value: 982454.9842643738
                    }
                  },
                  {
                    key: '5.0',
                    doc_count: 120,
                    sum: {
                      value: 831668.8991127014
                    }
                  },
                  {
                    key: '7.0',
                    doc_count: 86,
                    sum: {
                      value: 746187.5491752625
                    }
                  },
                  {
                    key: '3.0',
                    doc_count: 87,
                    sum: {
                      value: 624460.5026683807
                    }
                  },
                  {
                    key: '1.0',
                    doc_count: 47,
                    sum: {
                      value: 418691.68712997437
                    }
                  }
                ]
              }
            },
            {
              key: 'Chicago Public Schools, IL',
              doc_count: 1291,
              terms: {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 36,
                buckets: [
                  {
                    key: '5.0',
                    doc_count: 353,
                    sum: {
                      value: 2834849.039703369
                    }
                  },
                  {
                    key: '2.0',
                    doc_count: 260,
                    sum: {
                      value: 2159473.974975586
                    }
                  },
                  {
                    key: '4.0',
                    doc_count: 178,
                    sum: {
                      value: 1265103.317993164
                    }
                  },
                  {
                    key: '3.0',
                    doc_count: 116,
                    sum: {
                      value: 1092895.722366333
                    }
                  },
                  {
                    key: '0.0',
                    doc_count: 105,
                    sum: {
                      value: 619770.5160751343
                    }
                  },
                  {
                    key: '8.0',
                    doc_count: 69,
                    sum: {
                      value: 558812.4596176147
                    }
                  },
                  {
                    key: '1.0',
                    doc_count: 70,
                    sum: {
                      value: 481842.10912132263
                    }
                  },
                  {
                    key: '9.0',
                    doc_count: 61,
                    sum: {
                      value: 377538.7209377289
                    }
                  },
                  {
                    key: '10.0',
                    doc_count: 18,
                    sum: {
                      value: 148339.1697998047
                    }
                  },
                  {
                    key: '6.0',
                    doc_count: 25,
                    sum: {
                      value: 121189.78030776978
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    }
  ])
  it('should work without reducers', () =>
    test(
      {
        key: 'widget',
        type: 'nLevelAggregation',
        config: {
          aggs: [
            {
              type: 'terms',
              field: 'Organization.NameState.untouched',
              data: {
                size: 10000000
              }
            },
            {
              type: 'terms',
              data: {
                script: "doc['PO.IssuedDate'].getMonth()",
                lang: 'expression',
                order: {
                  sum: 'desc'
                }
              }
            },
            {
              type: 'sum',
              field: 'PO.IssuedAmount'
            }
          ]
        }
      },
      {
        results: [
          {
            key: 'California State University-Fresno, CA',
            doc_count: 1574,
            terms: {
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 0,
              buckets: [
                {
                  key: '4.0',
                  doc_count: 892,
                  sum: {
                    value: 488363940.0390625
                  }
                },
                {
                  key: '3.0',
                  doc_count: 616,
                  sum: {
                    value: 62682913.21875
                  }
                },
                {
                  key: '2.0',
                  doc_count: 66,
                  sum: {
                    value: 6337980
                  }
                }
              ]
            }
          },
          {
            key: 'University Of Michigan at Ann Arbor, MI',
            doc_count: 1299,
            terms: {
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 140,
              buckets: [
                {
                  key: '10.0',
                  doc_count: 206,
                  sum: {
                    value: 4494826.968653679
                  }
                },
                {
                  key: '11.0',
                  doc_count: 125,
                  sum: {
                    value: 2480435.41474247
                  }
                },
                {
                  key: '8.0',
                  doc_count: 144,
                  sum: {
                    value: 2060078.2864041328
                  }
                },
                {
                  key: '4.0',
                  doc_count: 134,
                  sum: {
                    value: 1708329.3825302124
                  }
                },
                {
                  key: '9.0',
                  doc_count: 99,
                  sum: {
                    value: 1000498.0503225327
                  }
                },
                {
                  key: '0.0',
                  doc_count: 111,
                  sum: {
                    value: 982454.9842643738
                  }
                },
                {
                  key: '5.0',
                  doc_count: 120,
                  sum: {
                    value: 831668.8991127014
                  }
                },
                {
                  key: '7.0',
                  doc_count: 86,
                  sum: {
                    value: 746187.5491752625
                  }
                },
                {
                  key: '3.0',
                  doc_count: 87,
                  sum: {
                    value: 624460.5026683807
                  }
                },
                {
                  key: '1.0',
                  doc_count: 47,
                  sum: {
                    value: 418691.68712997437
                  }
                }
              ]
            }
          },
          {
            key: 'Chicago Public Schools, IL',
            doc_count: 1291,
            terms: {
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 36,
              buckets: [
                {
                  key: '5.0',
                  doc_count: 353,
                  sum: {
                    value: 2834849.039703369
                  }
                },
                {
                  key: '2.0',
                  doc_count: 260,
                  sum: {
                    value: 2159473.974975586
                  }
                },
                {
                  key: '4.0',
                  doc_count: 178,
                  sum: {
                    value: 1265103.317993164
                  }
                },
                {
                  key: '3.0',
                  doc_count: 116,
                  sum: {
                    value: 1092895.722366333
                  }
                },
                {
                  key: '0.0',
                  doc_count: 105,
                  sum: {
                    value: 619770.5160751343
                  }
                },
                {
                  key: '8.0',
                  doc_count: 69,
                  sum: {
                    value: 558812.4596176147
                  }
                },
                {
                  key: '1.0',
                  doc_count: 70,
                  sum: {
                    value: 481842.10912132263
                  }
                },
                {
                  key: '9.0',
                  doc_count: 61,
                  sum: {
                    value: 377538.7209377289
                  }
                },
                {
                  key: '10.0',
                  doc_count: 18,
                  sum: {
                    value: 148339.1697998047
                  }
                },
                {
                  key: '6.0',
                  doc_count: 25,
                  sum: {
                    value: 121189.78030776978
                  }
                }
              ]
            }
          }
        ]
      },
      [
        {
          aggs: {
            terms: {
              aggs: {
                terms: {
                  aggs: {
                    sum: {
                      sum: {
                        field: 'PO.IssuedAmount'
                      }
                    }
                  },
                  terms: {
                    field: undefined,
                    lang: 'expression',
                    order: {
                      sum: 'desc'
                    },
                    script: "doc['PO.IssuedDate'].getMonth()"
                  }
                }
              },
              terms: {
                field: 'Organization.NameState.untouched',
                size: 10000000
              }
            }
          }
        }
      ]
    ))
  it('should work with peakBy reducer', () =>
    test(
      {
        key: 'widget',
        type: 'nLevelAggregation',
        config: {
          aggs: [
            {
              type: 'terms',
              field: 'Organization.NameState.untouched',
              data: {
                size: 10000000
              }
            },
            {
              type: 'terms',
              data: {
                script: "doc['PO.IssuedDate'].getMonth()",
                lang: 'expression',
                order: {
                  sum: 'desc'
                }
              }
            },
            {
              type: 'sum',
              field: 'PO.IssuedAmount'
            }
          ],
          reducers: [
            {
              type: 'peakBy',
              config: {
                field: 'sum.value'
              }
            }
          ]
        }
      },
      {
        results: [
          {
            doc_count: 892,
            id: 'California State University-Fresno, CA',
            key: '4.0',
            peakKey: 4,
            sum: {
              value: 488363940.0390625
            }
          },
          {
            doc_count: 206,
            id: 'University Of Michigan at Ann Arbor, MI',
            key: '10.0',
            peakKey: 10,
            sum: {
              value: 4494826.968653679
            }
          },
          {
            doc_count: 353,
            id: 'Chicago Public Schools, IL',
            key: '5.0',
            peakKey: 5,
            sum: {
              value: 2834849.039703369
            }
          }
        ],
        totalRecords: 3
      },
      [
        {
          aggs: {
            terms: {
              aggs: {
                terms: {
                  aggs: {
                    sum: {
                      sum: {
                        field: 'PO.IssuedAmount'
                      }
                    }
                  },
                  terms: {
                    field: undefined,
                    lang: 'expression',
                    order: {
                      sum: 'desc'
                    },
                    script: "doc['PO.IssuedDate'].getMonth()"
                  }
                }
              },
              terms: {
                field: 'Organization.NameState.untouched',
                size: 10000000
              }
            }
          }
        }
      ]
    ))
  it('should work with peakBy and filter reducers', () =>
    test(
      {
        key: 'widget',
        type: 'nLevelAggregation',
        config: {
          aggs: [
            {
              type: 'terms',
              field: 'Organization.NameState.untouched',
              data: {
                size: 10000000
              }
            },
            {
              type: 'terms',
              data: {
                script: "doc['PO.IssuedDate'].getMonth()",
                lang: 'expression',
                order: {
                  sum: 'desc'
                }
              }
            },
            {
              type: 'sum',
              field: 'PO.IssuedAmount'
            }
          ],
          reducers: [
            {
              type: 'peakBy',
              config: {
                field: 'sum.value'
              }
            },
            {
              type: 'filter',
              config: {
                field: 'peakKey',
                value: 10
              }
            }
          ]
        }
      },
      {
        results: [
          {
            doc_count: 206,
            id: 'University Of Michigan at Ann Arbor, MI',
            key: '10.0',
            peakKey: 10,
            sum: {
              value: 4494826.968653679
            }
          }
        ],
        totalRecords: 1
      },
      [
        {
          aggs: {
            terms: {
              aggs: {
                terms: {
                  aggs: {
                    sum: {
                      sum: {
                        field: 'PO.IssuedAmount'
                      }
                    }
                  },
                  terms: {
                    field: undefined,
                    lang: 'expression',
                    order: {
                      sum: 'desc'
                    },
                    script: "doc['PO.IssuedDate'].getMonth()"
                  }
                }
              },
              terms: {
                field: 'Organization.NameState.untouched',
                size: 10000000
              }
            }
          }
        }
      ]
    ))
  it('should work with peakBy and orderBy reducers', () =>
    test(
      {
        key: 'widget',
        type: 'nLevelAggregation',
        config: {
          aggs: [
            {
              type: 'terms',
              field: 'Organization.NameState.untouched',
              data: {
                size: 10000000
              }
            },
            {
              type: 'terms',
              data: {
                script: "doc['PO.IssuedDate'].getMonth()",
                lang: 'expression',
                order: {
                  sum: 'desc'
                }
              }
            },
            {
              type: 'sum',
              field: 'PO.IssuedAmount'
            }
          ],
          reducers: [
            {
              type: 'peakBy',
              config: {
                field: 'sum.value'
              }
            },
            {
              type: 'orderBy',
              config: {
                field: 'sum.value',
                order: 'asc'
              }
            }
          ]
        }
      },
      {
        results: [
          {
            doc_count: 353,
            id: 'Chicago Public Schools, IL',
            key: '5.0',
            peakKey: 5,
            sum: {
              value: 2834849.039703369
            }
          },
          {
            doc_count: 206,
            id: 'University Of Michigan at Ann Arbor, MI',
            key: '10.0',
            peakKey: 10,
            sum: {
              value: 4494826.968653679
            }
          },
          {
            doc_count: 892,
            id: 'California State University-Fresno, CA',
            key: '4.0',
            peakKey: 4,
            sum: {
              value: 488363940.0390625
            }
          }
        ],
        totalRecords: 3
      },
      [
        {
          aggs: {
            terms: {
              aggs: {
                terms: {
                  aggs: {
                    sum: {
                      sum: {
                        field: 'PO.IssuedAmount'
                      }
                    }
                  },
                  terms: {
                    field: undefined,
                    lang: 'expression',
                    order: {
                      sum: 'desc'
                    },
                    script: "doc['PO.IssuedDate'].getMonth()"
                  }
                }
              },
              terms: {
                field: 'Organization.NameState.untouched',
                size: 10000000
              }
            }
          }
        }
      ]
    ))
  it('should work with peakBy and gt reducers', () =>
    test(
      {
        key: 'widget',
        type: 'nLevelAggregation',
        config: {
          aggs: [
            {
              type: 'terms',
              field: 'Organization.NameState.untouched',
              data: {
                size: 10000000
              }
            },
            {
              type: 'terms',
              data: {
                script: "doc['PO.IssuedDate'].getMonth()",
                lang: 'expression',
                order: {
                  sum: 'desc'
                }
              }
            },
            {
              type: 'sum',
              field: 'PO.IssuedAmount'
            }
          ],
          reducers: [
            {
              type: 'peakBy',
              config: {
                field: 'sum.value'
              }
            },
            {
              type: 'filter',
              config: {
                field: 'sum.value',
                gt: 5000000
              }
            }
          ]
        }
      },
      {
        results: [
          {
            doc_count: 892,
            id: 'California State University-Fresno, CA',
            key: '4.0',
            peakKey: 4,
            sum: {
              value: 488363940.0390625
            }
          }
        ],
        totalRecords: 1
      },
      [
        {
          aggs: {
            terms: {
              aggs: {
                terms: {
                  aggs: {
                    sum: {
                      sum: {
                        field: 'PO.IssuedAmount'
                      }
                    }
                  },
                  terms: {
                    field: undefined,
                    lang: 'expression',
                    order: {
                      sum: 'desc'
                    },
                    script: "doc['PO.IssuedDate'].getMonth()"
                  }
                }
              },
              terms: {
                field: 'Organization.NameState.untouched',
                size: 10000000
              }
            }
          }
        }
      ]
    ))
  it('should work with peakBy and lt reducers', () =>
    test(
      {
        key: 'widget',
        type: 'nLevelAggregation',
        config: {
          aggs: [
            {
              type: 'terms',
              field: 'Organization.NameState.untouched',
              data: {
                size: 10000000
              }
            },
            {
              type: 'terms',
              data: {
                script: "doc['PO.IssuedDate'].getMonth()",
                lang: 'expression',
                order: {
                  sum: 'desc'
                }
              }
            },
            {
              type: 'sum',
              field: 'PO.IssuedAmount'
            }
          ],
          reducers: [
            {
              type: 'peakBy',
              config: {
                field: 'sum.value'
              }
            },
            {
              type: 'filter',
              config: {
                field: 'sum.value',
                lt: 5000000
              }
            }
          ]
        }
      },
      {
        results: [
          {
            doc_count: 206,
            id: 'University Of Michigan at Ann Arbor, MI',
            key: '10.0',
            peakKey: 10,
            sum: {
              value: 4494826.968653679
            }
          },
          {
            doc_count: 353,
            id: 'Chicago Public Schools, IL',
            key: '5.0',
            peakKey: 5,
            sum: {
              value: 2834849.039703369
            }
          }
        ],
        totalRecords: 2
      },
      [
        {
          aggs: {
            terms: {
              aggs: {
                terms: {
                  aggs: {
                    sum: {
                      sum: {
                        field: 'PO.IssuedAmount'
                      }
                    }
                  },
                  terms: {
                    field: undefined,
                    lang: 'expression',
                    order: {
                      sum: 'desc'
                    },
                    script: "doc['PO.IssuedDate'].getMonth()"
                  }
                }
              },
              terms: {
                field: 'Organization.NameState.untouched',
                size: 10000000
              }
            }
          }
        }
      ]
    ))
  it('should work with peakBy and lte reducers', () =>
    test(
      {
        key: 'widget',
        type: 'nLevelAggregation',
        config: {
          aggs: [
            {
              type: 'terms',
              field: 'Organization.NameState.untouched',
              data: {
                size: 10000000
              }
            },
            {
              type: 'terms',
              data: {
                script: "doc['PO.IssuedDate'].getMonth()",
                lang: 'expression',
                order: {
                  sum: 'desc'
                }
              }
            },
            {
              type: 'sum',
              field: 'PO.IssuedAmount'
            }
          ],
          reducers: [
            {
              type: 'peakBy',
              config: {
                field: 'sum.value'
              }
            },
            {
              type: 'filter',
              config: {
                field: 'sum.value',
                lte: 4494826.968653679
              }
            }
          ]
        }
      },
      {
        results: [
          {
            doc_count: 206,
            id: 'University Of Michigan at Ann Arbor, MI',
            key: '10.0',
            peakKey: 10,
            sum: {
              value: 4494826.968653679
            }
          },
          {
            doc_count: 353,
            id: 'Chicago Public Schools, IL',
            key: '5.0',
            peakKey: 5,
            sum: {
              value: 2834849.039703369
            }
          }
        ],
        totalRecords: 2
      },
      [
        {
          aggs: {
            terms: {
              aggs: {
                terms: {
                  aggs: {
                    sum: {
                      sum: {
                        field: 'PO.IssuedAmount'
                      }
                    }
                  },
                  terms: {
                    field: undefined,
                    lang: 'expression',
                    order: {
                      sum: 'desc'
                    },
                    script: "doc['PO.IssuedDate'].getMonth()"
                  }
                }
              },
              terms: {
                field: 'Organization.NameState.untouched',
                size: 10000000
              }
            }
          }
        }
      ]
    ))
  it('should work with peakBy and gte reducers', () =>
    test(
      {
        key: 'widget',
        type: 'nLevelAggregation',
        config: {
          aggs: [
            {
              type: 'terms',
              field: 'Organization.NameState.untouched',
              data: {
                size: 10000000
              }
            },
            {
              type: 'terms',
              data: {
                script: "doc['PO.IssuedDate'].getMonth()",
                lang: 'expression',
                order: {
                  sum: 'desc'
                }
              }
            },
            {
              type: 'sum',
              field: 'PO.IssuedAmount'
            }
          ],
          reducers: [
            {
              type: 'peakBy',
              config: {
                field: 'sum.value'
              }
            },
            {
              type: 'filter',
              config: {
                field: 'sum.value',
                gte: 488363940.0390625
              }
            }
          ]
        }
      },
      {
        results: [
          {
            doc_count: 892,
            id: 'California State University-Fresno, CA',
            key: '4.0',
            peakKey: 4,
            sum: {
              value: 488363940.0390625
            }
          }
        ],
        totalRecords: 1
      },
      [
        {
          aggs: {
            terms: {
              aggs: {
                terms: {
                  aggs: {
                    sum: {
                      sum: {
                        field: 'PO.IssuedAmount'
                      }
                    }
                  },
                  terms: {
                    field: undefined,
                    lang: 'expression',
                    order: {
                      sum: 'desc'
                    },
                    script: "doc['PO.IssuedDate'].getMonth()"
                  }
                }
              },
              terms: {
                field: 'Organization.NameState.untouched',
                size: 10000000
              }
            }
          }
        }
      ]
    ))
  it('should work with peakBy and eq reducers', () =>
    test(
      {
        key: 'widget',
        type: 'nLevelAggregation',
        config: {
          aggs: [
            {
              type: 'terms',
              field: 'Organization.NameState.untouched',
              data: {
                size: 10000000
              }
            },
            {
              type: 'terms',
              data: {
                script: "doc['PO.IssuedDate'].getMonth()",
                lang: 'expression',
                order: {
                  sum: 'desc'
                }
              }
            },
            {
              type: 'sum',
              field: 'PO.IssuedAmount'
            }
          ],
          reducers: [
            {
              type: 'peakBy',
              config: {
                field: 'sum.value'
              }
            },
            {
              type: 'filter',
              config: {
                field: 'sum.value',
                eq: 4494826.968653679
              }
            }
          ]
        }
      },
      {
        results: [
          {
            doc_count: 206,
            id: 'University Of Michigan at Ann Arbor, MI',
            key: '10.0',
            peakKey: 10,
            sum: {
              value: 4494826.968653679
            }
          }
        ],
        totalRecords: 1
      },
      [
        {
          aggs: {
            terms: {
              aggs: {
                terms: {
                  aggs: {
                    sum: {
                      sum: {
                        field: 'PO.IssuedAmount'
                      }
                    }
                  },
                  terms: {
                    field: undefined,
                    lang: 'expression',
                    order: {
                      sum: 'desc'
                    },
                    script: "doc['PO.IssuedDate'].getMonth()"
                  }
                }
              },
              terms: {
                field: 'Organization.NameState.untouched',
                size: 10000000
              }
            }
          }
        }
      ]
    ))
})
