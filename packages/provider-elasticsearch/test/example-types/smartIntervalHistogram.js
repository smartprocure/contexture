let sequentialResultTest = require('./testUtils').sequentialResultTest

describe('smartIntervalHistogram', () => {
  let test = (...x) =>
    sequentialResultTest(
      [
        {
          aggregations: {
            statistical: {
              count: 6,
              min: 10,
              max: 5000,
              avg: 78.5,
              sum: 471,
            },
          },
        },
        {
          aggregations: {
            histogram: {
              buckets: [
                {
                  key: 0,
                  doc_count: 8587960,
                },
                {
                  key: 250,
                  doc_count: 613556605,
                },
                {
                  key: 500,
                  doc_count: 1,
                },
                {
                  key: 750,
                  doc_count: 1,
                },
              ],
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
        type: 'smartIntervalHistogram',
        field: 'LineItem.TotalPrice',
      },
      {
        interval: 250,
        entries: [
          {
            key: 0,
            count: 8587960,
          },
          {
            key: 250,
            count: 613556605,
          },
          {
            key: 500,
            count: 1,
          },
          {
            key: 750,
            count: 1,
          },
        ],
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
        {
          aggs: {
            histogram: {
              histogram: {
                field: 'LineItem.TotalPrice',
                interval: 250,
                min_doc_count: 0,
              },
            },
          },
        },
      ]
    ))
})
