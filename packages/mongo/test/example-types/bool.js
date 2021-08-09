let bool = require('../../src/example-types/bool')

let node = {
  type: 'bool',
  field: 'test',
}

describe('bool', () => {
  describe('bool.hasValue', () => {
    it('Should detect a boolean value, null or undefined only', () => {
      expect(bool.hasValue({ ...node, value: true })).toBe(true)
      expect(bool.hasValue({ ...node, value: false })).toBe(true)
      expect(bool.hasValue(node)).toBe(false)
      expect(bool.hasValue({ ...node, value: null })).toBe(false)
      expect(bool.hasValue({ ...node, value: undefined })).toBe(false)
      expect(bool.hasValue({ ...node, value: 0 })).toBe(false)
      expect(bool.hasValue({ ...node, value: '' })).toBe(false)
      expect(bool.hasValue({ ...node, value: [] })).toBe(false)
    })
  })
  describe('bool.filter', () => {
    let neResult = { myField: { $ne: true } }
    it('Should work', () => {
      expect(
        bool.filter({
          field: 'myField',
          value: true,
        })
      ).toEqual({ myField: true })
      expect(
        bool.filter({
          field: 'myField',
          value: false,
        })
      ).toEqual(neResult)
      expect(
        bool.filter({
          field: 'myField',
        })
      ).toEqual(neResult)
      expect(
        bool.filter({
          field: 'myField',
          value: null,
        })
      ).toEqual(neResult)
    })
  })
})
