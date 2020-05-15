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
  describe('date.hasValue', () => {
    it('should check for values', () => {
      expect(
        !!date.hasValue(
          dateBuilder({
            range: 'exact',
            from: '2017-09-28',
          })
        )
      ).to.be.true
      expect(
        !!date.hasValue(
          dateBuilder({
            range: 'exact',
            from: null,
          })
        )
      ).to.be.false
    })
  })
  describe('date.filter', () => {
    it('basic', () => {
      expect(
        date.filter(
          dateBuilder({
            range: 'exact',
            from: '2017-09-28',
          })
        )
      ).to.deep.equal({
        test: {
          $gte: new Date('2017-09-28'),
        },
      })
    })
    // TODO: lastQuarter, thisQuarter, nextQuarter
    it('ms timestamp', () => {
      expect(
        date.filter(
          dateBuilder({
            range: 'exact',
            dateType: 'timestamp',
            from: '2018-07-10',
          })
        )
      ).to.deep.equal({
        test: {
          $gte: new Date('2018-07-10').getTime(),
        },
      })
    })
    it('unix timestamp', () => {
      expect(
        date.filter(
          dateBuilder({
            range: 'exact',
            dateType: 'unix',
            from: '2018-07-10',
          })
        )
      ).to.deep.equal({
        test: {
          $gte: new Date('2018-07-10').getTime() / 1000,
        },
      })
    })
  })
})
