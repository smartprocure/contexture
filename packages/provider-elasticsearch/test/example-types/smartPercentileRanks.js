let sequentialResultTest = require('./testUtils').sequentialResultTest

describe('smartPercentileRanks', () => {
  let test = (...x) =>
    sequentialResultTest(
      [
        {
          aggregations: {
            statistical: {
              avg: 68.53991504677647,
              count: 451,
              max: 85,
              min: 5.570000171661377,
              sum: 30911.50168609619,
            },
          },
        },
        {
          aggregations: {
            price_ranges: {
              buckets: [
                {
                  doc_count: 2,
                  key: '*-8.5',
                  to: 8.5,
                },
                {
                  doc_count: 129,
                  from: 25.5,
                  key: '25.5-63.75',
                  to: 63.75,
                },
                {
                  doc_count: 310,
                  from: 63.75,
                  key: '63.75-*',
                },
              ],
            },
          },
        },
      ],
      ...x
    )
  it('smartPercentileRanks should work', () =>
    test(
      {
        key: 'test',
        type: 'smartPercentileRanks',
        field: 'LineItem.UnitPrice',
        percents: [10, 30, 75],
      },
      {
        percentileRanks: [
          {
            doc_count: 2,
            key: '*-8.5',
            percent: 10,
            to: 8.5,
          },
          {
            doc_count: 129,
            from: 25.5,
            key: '25.5-63.75',
            percent: 30,
            to: 63.75,
          },
          {
            doc_count: 310,
            from: 63.75,
            key: '63.75-*',
            percent: 75,
          },
        ],
      },
      [
        {
          aggs: {
            statistical: {
              stats: {
                field: 'LineItem.UnitPrice',
                missing: 0,
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
                    to: 8.5,
                  },
                  {
                    from: 25.5,
                    to: 63.75,
                  },
                  {
                    from: 63.75,
                  },
                ],
              },
            },
          },
        },
      ]
    ))
})
