let { hasValue, filter } = require('../../../src/example-types/filters/bool')
let { expect } = require('chai')

describe('bool', function() {
  describe('hasValue', () => {
    it('should detect a boolean value only', () => {
      let node = { type: 'bool', field: 'test' }
      expect(hasValue({ ...node, value: true })).to.be.true
      expect(hasValue({ ...node, value: false })).to.be.true
      expect(hasValue({ ...node, value: null })).to.be.false
      expect(hasValue({ ...node, value: undefined })).to.be.false
      expect(hasValue(node)).to.be.false
    })
  })
  it('should filter properly', function() {
    let input = { type: 'bool', field: 'test', value: true }
    let expected = { term: { test: true } }
    expect(filter(input)).to.deep.equal(expected)
  })
  it('should filter properly if false', function() {
    let input = { type: 'bool', field: 'test', value: false }
    let expected = { term: { test: false } }
    expect(filter(input)).to.deep.equal(expected)
  })
})
