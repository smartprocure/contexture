let { expect } = require('chai')
let _ = require('lodash')
let date = require('../../src/example-types/date')

let dateBuilder = data =>
  _.extend(
    {
      key: 'test',
      type: 'date',
      field: 'test',
    },
    data
  )

describe('date', () => {
  it('should check for values', () => {
    expect(
      !!date.hasValue(
        dateBuilder({
          from: '2017-09-28',
        })
      )
    ).to.be.true
    expect(
      !!date.hasValue(
        dateBuilder({
          from: null,
        })
      )
    ).to.be.false
  })
  describe('filter', () => {
    it('basic', () => {
      expect(
        date.filter(
          dateBuilder({
            from: '2017-09-28',
          })
        )
      ).to.deep.equal({
        test: {
          $gte: new Date('2017-09-28'),
        },
      })
    })
    it('basic datemath', () => {
      expect(
        date.filter(
          dateBuilder({
            useDateMath: true,
            from: '2017-09-28T00:00:00.000Z||-1d',
          })
        )
      ).to.deep.equal({
        test: {
          $gte: new Date('2017-09-27T00:00:00.000Z'),
        },
      })
    })
    // TODO: lastQuarter, thisQuarter, nextQuarter
  })
})
