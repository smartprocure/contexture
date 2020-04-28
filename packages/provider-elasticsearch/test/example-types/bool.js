let bool = require('../../src/example-types/bool')
let { expect } = require('chai')

describe('bool', function() {
  describe('hasValue', () => {
    let node = {
      type: 'bool',
      field: 'test'
    }
    it('should detect a boolean value only', () => {
      expect(bool.hasValue({ ...node, value: true })).to.be.true
      expect(bool.hasValue({ ...node, value: false })).to.be.true
      expect(bool.hasValue({ ...node, value: null })).to.be.false
      expect(bool.hasValue({ ...node, value: undefined })).to.be.false
      expect(bool.hasValue(node)).to.be.false
    })
  })
  it('should filter properly', function() {
    expect(
      bool.filter({
        type: 'bool',
        field: 'test',
        value: true,
      })
    ).to.deep.equal({
      term: {
        test: true,
      },
    })
  })
  it('should filter properly if false', function() {
    expect(
      bool.filter({
        type: 'bool',
        field: 'test',
        value: false,
      })
    ).to.deep.equal({
      term: {
        test: false,
      },
    })
  })
})
