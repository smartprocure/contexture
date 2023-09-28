import exists from './exists.js'

describe('exists', () => {
  describe('hasValue', () => {
    let node = {
      type: 'bool',
      field: 'test',
    }
    it('should detect a boolean value only', () => {
      expect(exists.hasValue({ ...node, value: true })).toBe(true)
      expect(exists.hasValue({ ...node, value: false })).toBe(true)
      expect(exists.hasValue({ ...node, value: null })).toBe(false)
      expect(exists.hasValue({ ...node, value: undefined })).toBe(false)
      expect(exists.hasValue(node)).toBe(false)
    })
  })
  it('should filter properly', () => {
    expect(
      exists.filter({
        type: 'bool',
        field: 'test',
        value: true,
      })
    ).toEqual({
      exists: {
        field: 'test',
      },
    })
  })
  it('should filter properly if false', () => {
    expect(
      exists.filter({
        type: 'bool',
        field: 'test',
        value: false,
      })
    ).toEqual({
      bool: {
        must_not: {
          exists: {
            field: 'test',
          },
        },
      },
    })
  })
})
