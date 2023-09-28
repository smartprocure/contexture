import date from './date.js'

describe('date/filter', () => {
  it('should handle from', () => {
    expect(
      date.filter({
        type: 'date',
        field: 'test',
        range: 'exact',
        from: '2016-04-25',
      })
    ).toEqual({
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
    ).toEqual({
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
    ).toEqual({
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
    ).toEqual({
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
