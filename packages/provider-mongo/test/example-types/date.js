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
  })
  describe('date.filter', () => {
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
    it('ms timestamp', () => {
      expect(
        date.filter(
          dateBuilder({
            dateType: 'timestamp',
            from: '2018-07-10',
          })
        )
      ).to.deep.equal({
        test: {
          $gte: (new Date('2018-07-10')).getTime(),
        },
      })
    })
    it('unix timestamp', () => {
      expect(
        date.filter(
          dateBuilder({
            dateType: 'unix',
            from: '2018-07-10',
          })
        )
      ).to.deep.equal({
        test: {
          $gte: (new Date('2018-07-10')).getTime() / 1000,
        },
      })
    })
  })
})
