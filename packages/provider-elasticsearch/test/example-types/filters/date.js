let date = require('../../../src/example-types/filters/date')
let { expect } = require('chai')

describe('date/filter', () => {
  it('should handle from', () => {
    expect(
      date.filter({
        type: 'date',
        field: 'test',
        range: 'exact',
        from: '2016-04-25',
      })
    ).to.deep.equal({
      range: {
        test: {
          gte: '2016-04-25T00:00:00.000Z',
          format: 'date_optional_time',
        },
      },
    })
  })
  it('should handle to', () => {
    expect(
      date.filter({
        type: 'date',
        field: 'test',
        range: 'exact',
        to: '2016-04-25T00:00:00.000Z',
      })
    ).to.deep.equal({
      range: {
        test: {
          lte: '2016-04-25T00:00:00.000Z',
          format: 'date_optional_time',
        },
      },
    })
  })
  it('should handle from and to', () => {
    expect(
      date.filter({
        type: 'date',
        field: 'test',
        range: 'exact',
        from: '2015-04-25',
        to: '2016-04-25',
      })
    ).to.deep.equal({
      range: {
        test: {
          lte: '2016-04-25T00:00:00.000Z',
          gte: '2015-04-25T00:00:00.000Z',
          format: 'date_optional_time',
        },
      },
    })
  })
  it('should handle isDateTime', () => {
    expect(
      date.filter({
        type: 'date',
        field: 'test',
        range: 'exact',
        from: 'a very specific date',
        to: 'another very specific date',
        isDateTime: true,
      })
    ).to.deep.equal({
      range: {
        test: {
          gte: 'a very specific date',
          lte: 'another very specific date',
          format: 'date_optional_time',
        },
      },
    })
  })
})
