let _ = require('lodash/fp')
let exists = require('../../src/example-types/exists')

let node = {
  type: 'exists',
  field: 'test',
}

describe('exists', () => {
  describe('exists.hasValue', () => {
    it('Should detect a boolean value only', () => {
      expect(exists.hasValue({ ...node, value: true })).toBe(true)
      expect(exists.hasValue({ ...node, value: false })).toBe(true)
      expect(exists.hasValue(node)).toBe(false)
      expect(exists.hasValue({ ...node, value: null })).toBe(false)
      expect(exists.hasValue({ ...node, value: undefined })).toBe(false)
    })
  })
  describe('exists.filter', () => {
    it('If a value is provided, use $and', () => {
      expect(
        _.get(
          '$and.0.myField.$exists',
          exists.filter({
            value: 'myValue',
            field: 'myField',
          })
        )
      ).toBe('myValue')
    })
    it('If no value is provided, use $or', () => {
      expect(
        _.get(
          '$or.0.myField.$exists',
          exists.filter({
            field: 'myField',
          })
        )
      ).toBe(false)
    })
  })
})
