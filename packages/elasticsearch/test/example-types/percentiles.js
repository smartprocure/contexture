let sequentialResultTest = require('./testUtils').sequentialResultTest

describe('percentiles', () => {
  let percentilesTest1 = (...x) =>
    sequentialResultTest(
      [
        {
          aggregations: {
            agg_percentiles: {
              keyed: false,
              values: {
                10.0: 44,
                30.0: 63,
                75.0: 80.5,
              },
            },
          },
        },
      ],
      ...x
    )
  let percentilesTest2 = (...x) =>
    sequentialResultTest(
      [
        {
          aggregations: {
            agg_percentiles: {
              keyed: true,
              values: [
                {
                  key: 10.0,
                  value: 44,
                },
                {
                  key: 30.0,
                  value: 63,
                },
                {
                  key: 70.0,
                  value: 80.5,
                },
              ],
            },
          },
        },
      ],
      ...x
    )
  it('percentiles should work', () =>
    percentilesTest1(
      {
        key: 'test',
        type: 'percentiles',
        field: 'LineItem.UnitPrice',
        percents: [10, 30, 75],
      },
      {
        percentiles: {
          keyed: false,
          values: {
            10.0: 44,
            30.0: 63,
            75.0: 80.5,
          },
        },
      },
      [
        {
          aggs: {
            agg_percentiles: {
              percentiles: {
                keyed: false,
                field: 'LineItem.UnitPrice',
                percents: [10, 30, 75],
              },
            },
          },
        },
      ]
    ))
  it('percentiles should work with keyed', () =>
    percentilesTest2(
      {
        key: 'test',
        type: 'percentiles',
        keyed: true,
        field: 'LineItem.UnitPrice',
        percents: [10, 30, 75],
      },
      {
        percentiles: {
          keyed: true,
          values: [
            {
              key: 10.0,
              value: 44,
            },
            {
              key: 30.0,
              value: 63,
            },
            {
              key: 70.0,
              value: 80.5,
            },
          ],
        },
      },
      [
        {
          aggs: {
            agg_percentiles: {
              percentiles: {
                keyed: true,
                field: 'LineItem.UnitPrice',
                percents: [10, 30, 75],
              },
            },
          },
        },
      ]
    ))
})
