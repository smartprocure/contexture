let sequentialResultTest = require('./testUtils').sequentialResultTest

describe('statistical', function() {
  let statsTest = (...x) =>
    sequentialResultTest(
      [
        {
          aggregations: {
            statistical: {
              count: 6,
              min: 60,
              max: 98,
              avg: 78.5,
              sum: 471,
            },
          },
        },
      ],
      ...x
    )
  it('should work', () =>
    statsTest(
      {
        key: 'test',
        type: 'statistical',
        field: 'LineItem.TotalPrice',
      },
      {
        count: 6,
        min: 60,
        max: 98,
        avg: 78.5,
        sum: 471,
      },
      [
        {
          aggs: {
            statistical: {
              stats: {
                field: 'LineItem.TotalPrice',
              },
            },
          },
        },
      ]
    ))
})
