let sequentialResultTest = require('./testUtils').sequentialResultTest

describe('dateHistogram', () => {
  let test = (...x) =>
    sequentialResultTest(
      [
        {
          aggregations: {
            max_date: {
              value: '2010',
            },
            min_date: {
              value: '2008',
            },
            twoLevelAgg: {
              buckets: [
                {
                  key: '2008',
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
                  key: '2010',
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
      ],
      ...x
    )
  it('should work', () =>
    test(
      {
        key: 'test',
        type: 'dateHistogram',
        key_field: 'PO.IssuedDate',
        value_field: 'LineItem.TotalPrice',
      },
      {
        entries: [
          {
            key: '2008',
            doc_count: 50,
            count: 6,
            min: 60,
            max: 98,
            avg: 78.5,
            sum: 471,
          },
          {
            key: '2010',
            doc_count: 50,
            count: 6,
            min: 60,
            max: 98,
            avg: 78.5,
            sum: 471,
          },
        ],
        maxDate: '2010',
        minDate: '2008',
      },
      [
        {
          aggs: {
            max_date: {
              max: {
                field: 'PO.IssuedDate',
              },
            },
            min_date: {
              min: {
                field: 'PO.IssuedDate',
              },
            },
            twoLevelAgg: {
              date_histogram: {
                field: 'PO.IssuedDate',
                interval: 'year',
                min_doc_count: 0,
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
})
