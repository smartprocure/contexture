let { expect } = require('chai')
let number = require('../../src/example-types/number')

describe('number', () => {
  describe('number.hasValue', () => {
    it('Allows optionally either min or max', () => {
      expect(number.hasValue({ min: 1 })).to.equal(true)
      expect(number.hasValue({ max: 2 })).to.equal(true)
    }),
    it('Allows 0 on min and max', () => {
      expect(number.hasValue({ min: 0 })).to.equal(true)
      expect(number.hasValue({ max: 0 })).to.equal(true)
    })
  })
  describe('number.filter', () => {
    it('Should convert both min and max to valid numbers', () => {
      expect(number.filter({
        min: '123',
        max: '321',
        field: 'myField',
      })).to.deep.equal({
        myField: {
          $gte: 123,
          $lte: 321,
        }
      })
    })
    it('Should remove unused properties', () => {
      expect(number.filter({
        min: '123',
        field: 'myField',
      })).to.deep.equal({
        myField: {
          $gte: 123,
        }
      })
      expect(number.filter({
        max: '321',
        field: 'myField',
      })).to.deep.equal({
        myField: {
          $lte: 321,
        }
      })
    })
  })
})
