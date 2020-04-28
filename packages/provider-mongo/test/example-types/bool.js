let { expect } = require('chai')
let bool = require('../../src/example-types/bool')

let node = {
  type: 'bool',
  field: 'test',
}

describe('bool', () => {
  describe('bool.hasValue', () => {
    it('Should detect a boolean value, null or undefined only', () => {
      expect(bool.hasValue({ ...node, value: true })).to.be.true
      expect(bool.hasValue({ ...node, value: false })).to.be.true
      expect(bool.hasValue(node)).to.be.false
      expect(bool.hasValue({ ...node, value: null })).to.be.false
      expect(bool.hasValue({ ...node, value: undefined })).to.be.false
      expect(bool.hasValue({ ...node, value: 0 })).to.be.false
      expect(bool.hasValue({ ...node, value: '' })).to.be.false
      expect(bool.hasValue({ ...node, value: [] })).to.be.false
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
      ).to.deep.equal({ myField: true })
      expect(
        bool.filter({
          field: 'myField',
          value: false
        })
      ).to.deep.equal(neResult)
      expect(
        bool.filter({
          field: 'myField',
        })
      ).to.deep.equal(neResult)
      expect(
        bool.filter({
          field: 'myField',
          value: null
        })
      ).to.deep.equal(neResult)
    })
  })
})
