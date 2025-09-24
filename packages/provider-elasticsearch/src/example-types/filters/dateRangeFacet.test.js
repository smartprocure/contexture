import _ from 'lodash/fp.js'
import {
  getDateIfValid,
  rollingRangeToDates,
} from 'contexture-util/dateUtil.js'
import dateRangeFacet, { genAggsQuery } from './dateRangeFacet.js'
import { expect, describe, it } from 'vitest'

let commonFilterParts = {
  type: 'dateRangeFacet',
  field: 'test',
  ranges: [
    { range: 'allFutureDates', key: 'open' },
    { range: 'allPastDates', key: 'expired' },
  ],
}

let getDatePart = (range, part) =>
  _.flow(_.get(part), getDateIfValid)(rollingRangeToDates(range, 'UTC'))

describe('validContext', () => {
  it('should validate a node with all required fields', () => {
    expect(
      dateRangeFacet.validContext({
        field: 'value_field',
        ranges: [{ key: 'asd', range: 'allFutureDates' }],
      })
    ).toBe(true)
  })
  it('should invalidate a node with no ranges prop', () => {
    expect(
      dateRangeFacet.validContext({
        field: 'value_field',
      })
    ).toBe(false)
  })
  it('should invalidate a node with missing range key', () => {
    expect(
      dateRangeFacet.validContext({
        field: 'value_field',
        ranges: [{ range: 'allPastDates' }],
      })
    ).toBe(false)
  })
})

describe('dateRangeFacet/filter', () => {
  it('should handle a "range"', () => {
    expect(
      dateRangeFacet.filter({
        ...commonFilterParts,
        values: ['open'],
      })
    ).toEqual({
      bool: {
        should: [
          {
            range: {
              test: {
                format: 'date_optional_time',
                gte: getDatePart('allFutureDates', 'from'),
              },
            },
          },
        ],
      },
    })
  })
})

describe('genAggsQuery', () => {
  it('should generate correct aggregation query with default format', () => {
    const field = 'test_field'
    const ranges = [
      { range: 'allFutureDates', key: 'future' },
      { range: 'allPastDates', key: 'past' },
    ]
    const timezone = 'UTC'

    const result = genAggsQuery(field, undefined, ranges, timezone)

    expect(result).toEqual({
      aggs: {
        range: {
          date_range: {
            field: 'test_field',
            format: 'date_optional_time',
            ranges: [
              {
                key: 'future',
                from: getDatePart('allFutureDates', 'from'),
              },
              {
                key: 'past',
                to: getDatePart('allPastDates', 'to'),
              },
            ],
          },
        },
      },
      size: 0,
    })
  })

  it('should handle empty ranges array', () => {
    const field = 'empty_field'
    const ranges = []
    const timezone = 'UTC'

    const result = genAggsQuery(field, undefined, ranges, timezone)

    expect(result).toEqual({
      aggs: {
        range: {
          date_range: {
            field: 'empty_field',
            format: 'date_optional_time',
            ranges: [],
          },
        },
      },
      size: 0,
    })
  })
})
