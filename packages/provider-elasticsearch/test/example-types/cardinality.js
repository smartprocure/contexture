let sequentialResultTest = require('./testUtils').sequentialResultTest

describe('cardinality', () => {
  let statsTest = (...x) =>
    sequentialResultTest(
      [
        {
          aggregations: {
            cardinality: {
              value: 471,
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
        type: 'cardinality',
        field: 'Organization.Name.untouched',
      },
      {
        value: 471,
      },
      [
        {
          aggs: {
            cardinality: {
              cardinality: {
                field: 'Organization.Name.untouched',
              },
            },
          },
        },
      ]
    ))
  it('should allow fieldMode', () => {
    statsTest(
      {
        key: 'test',
        type: 'cardinality',
        field: 'Organization.Name.untouched',
        fieldMode: 'word',
      },
      {
        value: 471,
      },
      [
        {
          aggs: {
            cardinality: {
              cardinality: {
                field: 'Organization.Name',
              },
            },
          },
        },
      ]
    )
    statsTest(
      {
        key: 'test',
        type: 'cardinality',
        field: 'Organization.Name.untouched',
        fieldMode: 'autocomplete',
      },
      {
        value: 471,
      },
      [
        {
          aggs: {
            cardinality: {
              cardinality: {
                field: 'Organization.Name.untouched',
              },
            },
          },
        },
      ]
    )
  })
})
