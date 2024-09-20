import { sequentialResultTest } from '../testUtils.js'
import { describe, it } from 'vitest'

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
})
