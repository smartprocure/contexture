let sequentialResultTest = require('./testUtils').sequentialResultTest

describe('percentilesRange', function() {
  let test = (...x) =>
    sequentialResultTest(
      [
        {
          aggregations: {
            agg_percentiles: {
              keyed: false,
              values: [
                {
                  key: 20,
                  value: 30.549999237060547,
                },
                {
                  key: 95,
                  value: 39.20000076293945,
                },
              ],
            },
          },
        },
        {
          aggregations: {
            price_ranges: {
              buckets: [
                {
                  doc_count: 3,
                  key: '*-30.549999237060547',
                  to: 30.549999237060547,
                },
                {
                  doc_count: 11,
                  from: 30.549999237060547,
                  key: '30.549999237060547-39.20000076293945',
                  to: 39.20000076293945,
                },
                {
                  doc_count: 3,
                  from: 39.20000076293945,
                  key: '39.20000076293945-*',
                },
              ],
            },
          },
        },
      ],
      ...x
    )
  it('percentileRange should work', () =>
    test(
      {
        key: 'test',
        type: 'percentilesRange',
        field: 'LineItem.UnitPrice',
        percents: [20, 95],
      },
      {
        percentilesRange: [
          {
            doc_count: 3,
            key: '*-30.549999237060547',
            to: 30.549999237060547,
          },
          {
            doc_count: 11,
            from: 30.549999237060547,
            key: '30.549999237060547-39.20000076293945',
            to: 39.20000076293945,
          },
          {
            doc_count: 3,
            from: 39.20000076293945,
            key: '39.20000076293945-*',
          },
        ],
      },
      [
        {
          aggs: {
            agg_percentiles: {
              percentiles: {
                keyed: false,
                field: 'LineItem.UnitPrice',
                percents: [20, 95],
              },
            },
          },
        },
        {
          aggs: {
            price_ranges: {
              range: {
                field: 'LineItem.UnitPrice',
                ranges: [
                  {
                    to: 30.549999237060547,
                  },
                  {
                    from: 30.549999237060547,
                    to: 39.20000076293945,
                  },
                  {
                    from: 39.20000076293945,
                  },
                ],
              },
            },
          },
        },
      ]
    ))
})
