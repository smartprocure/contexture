let { expect } = require('chai')
let bool = require('../../src/example-types/bool')

let node = {
  type: 'bool',
  field: 'test'
}

describe.only('bool', () => {
  describe('bool.hasValue', () => {
    it('should detect a boolean value and not anything else', () => {
      expect(bool.hasValue({...node, value: true })).to.be.true
      expect(bool.hasValue({...node, value: false })).to.be.true
      expect(bool.hasValue(node)).to.be.false
      expect(bool.hasValue({...node, value: null })).to.be.false
      expect(bool.hasValue({...node, value: 0 })).to.be.false
      expect(bool.hasValue({...node, value: undefined })).to.be.false
    })
  })
  describe('bool.filter', () => {
    it('Should work', () => {
      expect(
        bool.filter({
          field: 'myField',
          value: true
        })
      ).to.deep.equal({
        myField: true,
      })
    })
    it('falsySupport should work', () => {
      let falsyResult = {
        $or: [
          { test: false },
          { test: { $exists: false }},
          { test: '' },
          { test: null },
          { test: 0 },
        ]
      }
      let falsySupportNode = {...node, falsySupport: true }
      expect(bool.filter(falsySupportNode)).to.deep.equal(falsyResult)
      expect(bool.filter({...falsySupportNode, value: false })).to.deep.equal(falsyResult)
      expect(bool.filter({...falsySupportNode, value: true })).to.deep.equal({ test: true })
    })
  })
})
