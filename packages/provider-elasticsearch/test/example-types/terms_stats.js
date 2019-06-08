let sequentialResultTest = require('./testUtils').sequentialResultTest

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
                  'twoLevelAgg.sum': 'desc',
                },
              },
              aggs: {
                twoLevelAgg: {
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
                        'Organization.Name.untouched': '.*([Cc][Ii][Tt][Yy]).*',
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
                      'twoLevelAgg.sum': 'desc',
                    },
                  },
                  aggs: {
                    twoLevelAgg: {
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
                        'Organization.Name.untouched': '.*([Cc][Ii][Tt][Yy]).*',
                      },
                    },
                    {
                      regexp: {
                        'Organization.Name.untouched': '.*([Oo][Ff]).*',
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
                      'twoLevelAgg.sum': 'desc',
                    },
                  },
                  aggs: {
                    twoLevelAgg: {
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
                'twoLevelAgg_sum.value': 'desc',
              },
            },
            aggs: {
              twoLevelAgg_sum: {
                sum: {
                  field: 'LineItem.TotalPrice',
                },
              },
              twoLevelAgg_value_count: {
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
