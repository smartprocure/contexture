var exists = require('../../../src/example-types/filters/exists')
let { expect } = require('chai')

describe('exists', () => {
  describe('hasValue', () => {
    let node = {
      type: 'bool',
      field: 'test',
    }
    it('should detect a boolean value only', () => {
      expect(exists.hasValue({ ...node, value: true })).to.be.true
      expect(exists.hasValue({ ...node, value: false })).to.be.true
      expect(exists.hasValue({ ...node, value: null })).to.be.false
      expect(exists.hasValue({ ...node, value: undefined })).to.be.false
      expect(exists.hasValue(node)).to.be.false
    })
  })
  it('should filter properly', () => {
    expect(
      exists.filter({
        type: 'bool',
        field: 'test',
        value: true,
      })
    ).to.deep.equal({
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
    ).to.deep.equal({
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
