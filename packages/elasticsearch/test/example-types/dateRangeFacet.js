let _ = require('lodash/fp')
let { expect } = require('chai')
let { getDateIfValid, rollingRangeToDates } = require('../../src/dateUtil')
let dateRangeFacet = require('../../src/example-types/dateRangeFacet')

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
  it('should validate a context with all required fields', () => {
    expect(
      dateRangeFacet.validContext({
        field: 'value_field',
        ranges: [{ key: 'asd', range: 'allFutureDates' }],
      })
    ).to.be.true
  })
  it('should invalidate a context with no ranges prop', () => {
    expect(
      dateRangeFacet.validContext({
        field: 'value_field',
      })
    ).to.be.false
  })
  it('should invalidate a context with missing range key', () => {
    expect(
      dateRangeFacet.validContext({
        field: 'value_field',
        ranges: [{ to: 'now/d' }],
      })
    ).to.be.false
  })
})

describe('dateRangeFacet/filter', () => {
  it('should handle "allFutureDates range"', () => {
    expect(
      dateRangeFacet.filter({
        ...commonFilterParts,
        values: ['open'],
      })
    ).to.deep.equal({
      bool: {
        should: [
          {
            range: {
              test: {
                "format": "dateOptionalTime",
                from: getDatePart('allFutureDates', 'from')
            }
          }
        }]
      }
    })
  })
  it('should handle "allPastDates range"', () => {
    expect(
      dateRangeFacet.filter({
        ...commonFilterParts,
        values: ['expired'],
      })
    ).to.deep.equal({
      bool: {
        should: [
          {
            range: {
              test: {
                "format": "dateOptionalTime",
                to: getDatePart('allPastDates', 'to')
            }
          }
        }]
      }
    })
  })
})
