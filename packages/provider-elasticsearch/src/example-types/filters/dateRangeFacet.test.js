import _ from 'lodash/fp.js'
import { getDateIfValid, rollingRangeToDates } from '../../utils/dateUtil.js'
import dateRangeFacet from './dateRangeFacet.js'

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
                from: getDatePart('allFutureDates', 'from'),
              },
            },
          },
        ],
      },
    })
  })
})
