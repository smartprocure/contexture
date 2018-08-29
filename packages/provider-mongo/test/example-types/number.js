let { expect } = require('chai')
let number = require('../../src/example-types/number')

describe('number', () => {
  describe('number.hasValue', () => {
    it('Allows optionally either min or max', () => {
      expect(number.hasValue({ min: 1 })).to.equal(true)
      expect(number.hasValue({ max: 2 })).to.equal(true)
    })
    it('Allows 0 on min and max', () => {
      expect(number.hasValue({ min: 0 })).to.equal(true)
      expect(number.hasValue({ max: 0 })).to.equal(true)
    })
    it('Should reject empty string, null, undefined, Infinity, and NaN', () => {
      expect(number.hasValue({ min: '' })).to.equal(false)
      expect(number.hasValue({ max: '' })).to.equal(false)
      expect(number.hasValue({ min: null })).to.equal(false)
      expect(number.hasValue({ max: null })).to.equal(false)
      expect(number.hasValue({ min: undefined })).to.equal(false)
      expect(number.hasValue({ max: undefined })).to.equal(false)
      expect(number.hasValue({ min: Infinity })).to.equal(false)
      expect(number.hasValue({ max: Infinity })).to.equal(false)
      expect(number.hasValue({ min: NaN })).to.equal(false)
      expect(number.hasValue({ max: NaN })).to.equal(false)
    })
    it('Should handle numbers as strings', () => {
      expect(number.hasValue({ min: '10001' })).to.equal(true)
      expect(number.hasValue({ min: 'asda' })).to.equal(false)
      expect(number.hasValue({})).to.equal(false)
      expect(number.hasValue({ max: '10001' })).to.equal(true)
      expect(number.hasValue({ max: 'asda' })).to.equal(false)
      expect(number.hasValue({ min: '10001', max: 'asdfa' })).to.equal(true)
      expect(number.hasValue({ min: '10asd001', max: '1001' })).to.equal(true)
    })
  })
  describe('number.filter', () => {
    it('Should convert both min and max to valid numbers', () => {
      expect(
        number.filter({
          min: '123',
          max: '321',
          field: 'myField',
        })
      ).to.deep.equal({
        myField: {
          $gte: 123,
          $lte: 321,
        },
      })
    })
    it('Should remove unused properties', () => {
      expect(
        number.filter({
          min: '123',
          field: 'myField',
        })
      ).to.deep.equal({
        myField: {
          $gte: 123,
        },
      })
      expect(
        number.filter({
          max: '321',
          field: 'myField',
        })
      ).to.deep.equal({
        myField: {
          $lte: 321,
        },
      })
    })
    it('Should remove fields if not valid', () => {
      expect(
        number.filter({
          field: 'myField',
          min: '',
          max: null,
        })
      ).to.deep.equal({
        myField: {},
      })
      expect(
        number.filter({
          field: 'myField',
          min: undefined,
          max: 'foo',
        })
      ).to.deep.equal({
        myField: {},
      })
    })
  })
})
