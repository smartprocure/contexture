let sequentialResultTest = require('../testUtils').sequentialResultTest

describe('term_stats', () => {
  let test = (...x) =>
    sequentialResultTest(
      [
        {
          aggregations: {
            twoLevelFilter: {
              twoLevelAgg: {
                buckets: [
                  {
                    key: 'City of Deerfield',
                    doc_count: 50,
                    twoLevelAgg: {
                      count: 6,
                      min: 60,
                      max: 98,
                      avg: 78.5,
                      sum: 471,
                    },
                  },
                  {
                    key: 'City of Boca',
                    doc_count: 50,
                    twoLevelAgg: {
                      count: 6,
                      min: 60,
                      max: 98,
                      avg: 78.5,
                      sum: 471,
                    },
                  },
                ],
              },
            },
          },
        },
      ],
      ...x
    )
  let includeTest = (...x) =>
    sequentialResultTest(
      [
        {
          aggregations: {
            twoLevelFilter: {
              twoLevelAgg: {
                buckets: [
                  {
                    key: 'City of Deerfield',
                    doc_count: 50,
                    twoLevelAgg: {
                      count: 6,
                      sum: 471,
                    },
                  },
                  {
                    key: 'City of Boca',
                    doc_count: 50,
                    twoLevelAgg: {
                      count: 6,
                      sum: 471,
                    },
                  },
                ],
              },
            },
          },
        },
      ],
      ...x
    )
  it('should work', () =>
    test(
      {
        key: 'test',
        type: 'terms_stats',
        key_field: 'Organization.Name.untouched',
        value_field: 'LineItem.TotalPrice',
      },
      {
        terms: [
          {
            key: 'City of Deerfield',
            doc_count: 50,
            count: 6,
            min: 60,
            max: 98,
            avg: 78.5,
            sum: 471,
          },
          {
            key: 'City of Boca',
            doc_count: 50,
            count: 6,
            min: 60,
            max: 98,
            avg: 78.5,
            sum: 471,
          },
        ],
      },
      [
        {
          aggs: {
            twoLevelAgg: {
              terms: {
                field: 'Organization.Name.untouched',
                size: 10,
                order: {
                  'stats.sum': 'desc',
                },
              },
              aggs: {
                stats: {
                  stats: {
                    field: 'LineItem.TotalPrice',
                  },
                },
              },
            },
          },
        },
      ]
    ))
  it('should support a filter', () =>
    test(
      {
        key: 'test',
        type: 'terms_stats',
        key_field: 'Organization.Name.untouched',
        value_field: 'LineItem.TotalPrice',
        filter: 'city',
      },
      {
        terms: [
          {
            key: 'City of Deerfield',
            doc_count: 50,
            count: 6,
            min: 60,
            max: 98,
            avg: 78.5,
            sum: 471,
          },
          {
            key: 'City of Boca',
            doc_count: 50,
            count: 6,
            min: 60,
            max: 98,
            avg: 78.5,
            sum: 471,
          },
        ],
      },
      [
        {
          aggs: {
            twoLevelFilter: {
              filter: {
                bool: {
                  must: [
                    {
                      regexp: {
                        'Organization.Name.untouched': {
                          value: '.*(city).*',
                          case_insensitive: true,
                        },
                      },
                    },
                  ],
                },
              },
              aggs: {
                twoLevelAgg: {
                  terms: {
                    field: 'Organization.Name.untouched',
                    size: 10,
                    order: {
                      'stats.sum': 'desc',
                    },
                  },
                  aggs: {
                    stats: {
                      stats: {
                        field: 'LineItem.TotalPrice',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ]
    ))
  it('should support a filter with ridiculous spaces', () =>
    test(
      {
        key: 'test',
        type: 'terms_stats',
        key_field: 'Organization.Name.untouched',
        value_field: 'LineItem.TotalPrice',
        filter: 'city   of    ',
      },
      {
        terms: [
          {
            key: 'City of Deerfield',
            doc_count: 50,
            count: 6,
            min: 60,
            max: 98,
            avg: 78.5,
            sum: 471,
          },
          {
            key: 'City of Boca',
            doc_count: 50,
            count: 6,
            min: 60,
            max: 98,
            avg: 78.5,
            sum: 471,
          },
        ],
      },
      [
        {
          aggs: {
            twoLevelFilter: {
              filter: {
                bool: {
                  must: [
                    {
                      regexp: {
                        'Organization.Name.untouched': {
                          value: '.*(city).*',
                          case_insensitive: true,
                        },
                      },
                    },
                    {
                      regexp: {
                        'Organization.Name.untouched': {
                          value: '.*(of).*',
                          case_insensitive: true,
                        },
                      },
                    },
                  ],
                },
              },
              aggs: {
                twoLevelAgg: {
                  terms: {
                    field: 'Organization.Name.untouched',
                    size: 10,
                    order: {
                      'stats.sum': 'desc',
                    },
                  },
                  aggs: {
                    stats: {
                      stats: {
                        field: 'LineItem.TotalPrice',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ]
    ))
  it('should support include', () =>
    includeTest(
      {
        key: 'test',
        type: 'terms_stats',
        key_field: 'Organization.Name.untouched',
        value_field: 'LineItem.TotalPrice',
        include: ['value_count', 'sum'],
        order: 'sum',
        sortDir: 'desc',
      },
      {
        terms: [
          {
            key: 'City of Deerfield',
            doc_count: 50,
            count: 6,
            sum: 471,
          },
          {
            key: 'City of Boca',
            doc_count: 50,
            count: 6,
            sum: 471,
          },
        ],
      },
      [
        {
          aggs: {
            twoLevelAgg: {
              terms: {
                field: 'Organization.Name.untouched',
                size: 10,
                order: {
                  'sum.value': 'desc',
                },
              },
              aggs: {
                sum: {
                  sum: {
                    field: 'LineItem.TotalPrice',
                  },
                },
                value_count: {
                  value_count: {
                    field: 'LineItem.TotalPrice',
                  },
                },
              },
            },
          },
        },
      ]
    ))
})
