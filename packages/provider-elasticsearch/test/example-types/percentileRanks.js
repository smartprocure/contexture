let sequentialResultTest = require('./testUtils').sequentialResultTest

describe('percentileRanks', function() {
  let percentileRankTest1 = (...x) =>
    sequentialResultTest(
      [
        {
          aggregations: {
            agg_percentileRanks: {
              keyed: false,
              values: {
                10: 44,
                30: 63,
                75: 80.5
              }
            }
          }
        }
      ],
      ...x
    )
  let percentileRankTest2 = (...x) =>
    sequentialResultTest(
      [
        {
          aggregations: {
            agg_percentileRanks: {
              keyed: true,
              values: [
                {
                  key: 10,
                  value: 44
                },
                {
                  key: 30,
                  value: 63
                },
                {
                  key: 70,
                  value: 80.5
                }
              ]
            }
          }
        }
      ],
      ...x
    )
  it('percentile ranks should work', () =>
    percentileRankTest1(
      {
        key: 'test',
        type: 'percentileRanks',
        config: {
          field: 'LineItem.UnitPrice',
          keyed: false,
          values: [10, 30, 75]
        }
      },
      {
        percentileRanks: {
          keyed: false,
          values: {
            10: 44,
            30: 63,
            75: 80.5
          }
        }
      },
      [
        {
          aggs: {
            agg_percentileRanks: {
              percentile_ranks: {
                field: 'LineItem.UnitPrice',
                keyed: false,
                values: [10, 30, 75]
              }
            }
          }
        }
      ]
    ))
  it('percentile ranks should work with keyed', () =>
    percentileRankTest2(
      {
        key: 'test',
        type: 'percentileRanks',
        config: {
          field: 'LineItem.UnitPrice',
          keyed: true,
          values: [10, 30, 75]
        }
      },
      {
        percentileRanks: {
          keyed: true,
          values: [
            {
              key: 10,
              value: 44
            },
            {
              key: 30,
              value: 63
            },
            {
              key: 70,
              value: 80.5
            }
          ]
        }
      },
      [
        {
          aggs: {
            agg_percentileRanks: {
              percentile_ranks: {
                field: 'LineItem.UnitPrice',
                keyed: true,
                values: [10, 30, 75]
              }
            }
          }
        }
      ]
    ))
})
