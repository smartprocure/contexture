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
                  value: 138,
                },
                {
                  key: 55,
                  value: 203.57399468587244,
                },
                {
                  key: 95,
                  value: 276.52129629629627,
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
                  doc_count: 1783,
                  key: '*-137.99999999999997',
                  to: 137.99999999999997,
                },
                {
                  doc_count: 3703,
                  from: 203.62810095761603,
                  key: '203.62810095761603-276.5217105263158',
                  to: 276.5217105263158,
                },
                {
                  doc_count: 455,
                  from: 276.5217105263158,
                  key: '276.5217105263158-*',
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
        config: {
          field: 'LineItem.UnitPrice',
          percents: [20, 55, 95],
        },
      },
      {
        percentilesRange: [
          {
            doc_count: 1783,
            key: '*-137.99999999999997',
            percent: 20,
            to: 137.99999999999997,
          },
          {
            doc_count: 3703,
            from: 203.62810095761603,
            key: '203.62810095761603-276.5217105263158',
            percent: 55,
            to: 276.5217105263158,
          },
          {
            doc_count: 455,
            from: 276.5217105263158,
            key: '276.5217105263158-*',
            percent: 95,
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
                percents: [20, 55, 95],
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
                    to: 138,
                  },
                  {
                    from: 203.57399468587244,
                    to: 276.52129629629627,
                  },
                  {
                    from: 276.52129629629627,
                  },
                ],
              },
            },
          },
        },
      ]
    ))
})
