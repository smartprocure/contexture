import { hasValue, filter } from '../../../src/example-types/filters/bool.js'

describe('bool', () => {
  describe('hasValue', () => {
    it('should detect a boolean value only', () => {
      let node = { type: 'bool', field: 'test' }
      expect(hasValue({ ...node, value: true })).toBe(true)
      expect(hasValue({ ...node, value: false })).toBe(true)
      expect(hasValue({ ...node, value: null })).toBe(false)
      expect(hasValue({ ...node, value: undefined })).toBe(false)
      expect(hasValue(node)).toBe(false)
    })
  })
  it('should filter properly', () => {
    let input = { type: 'bool', field: 'test', value: true }
    let expected = { term: { test: true } }
    expect(filter(input)).toEqual(expected)
  })
  it('should filter properly if false', () => {
    let input = { type: 'bool', field: 'test', value: false }
    let expected = { term: { test: false } }
    expect(filter(input)).toEqual(expected)
  })
})
