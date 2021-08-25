let number = require('../../src/example-types/number')

describe('number', () => {
  describe('number.hasValue', () => {
    it('Allows optionally either min or max', () => {
      expect(number.hasValue({ min: 1 })).toBe(true)
      expect(number.hasValue({ max: 2 })).toBe(true)
    })
    it('Allows 0 on min and max', () => {
      expect(number.hasValue({ min: 0 })).toBe(true)
      expect(number.hasValue({ max: 0 })).toBe(true)
    })
    it('Should reject empty string, null, undefined, Infinity, and NaN', () => {
      expect(number.hasValue({ min: '' })).toBe(false)
      expect(number.hasValue({ max: '' })).toBe(false)
      expect(number.hasValue({ min: null })).toBe(false)
      expect(number.hasValue({ max: null })).toBe(false)
      expect(number.hasValue({ min: undefined })).toBe(false)
      expect(number.hasValue({ max: undefined })).toBe(false)
      expect(number.hasValue({ min: Infinity })).toBe(false)
      expect(number.hasValue({ max: Infinity })).toBe(false)
      expect(number.hasValue({ min: NaN })).toBe(false)
      expect(number.hasValue({ max: NaN })).toBe(false)
    })
    it('Should handle numbers as strings', () => {
      expect(number.hasValue({ min: '10001' })).toBe(true)
      expect(number.hasValue({ min: 'asda' })).toBe(false)
      expect(number.hasValue({})).toBe(false)
      expect(number.hasValue({ max: '10001' })).toBe(true)
      expect(number.hasValue({ max: 'asda' })).toBe(false)
      expect(number.hasValue({ min: '10001', max: 'asdfa' })).toBe(true)
      expect(number.hasValue({ min: '10asd001', max: '1001' })).toBe(true)
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
      ).toEqual({
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
      ).toEqual({
        myField: {
          $gte: 123,
        },
      })
      expect(
        number.filter({
          max: '321',
          field: 'myField',
        })
      ).toEqual({
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
      ).toEqual({
        myField: {},
      })
      expect(
        number.filter({
          field: 'myField',
          min: undefined,
          max: 'foo',
        })
      ).toEqual({
        myField: {},
      })
    })
  })
})
