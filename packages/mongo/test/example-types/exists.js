let { expect } = require('chai')
let _ = require('lodash/fp')
let exists = require('../../src/example-types/exists')

let node = {
  type: 'exists',
  field: 'test',
}

describe('exists', () => {
  describe('exists.hasValue', () => {
    it('Should detect a boolean value only', () => {
      expect(exists.hasValue({ ...node, value: true })).to.be.true
      expect(exists.hasValue({ ...node, value: false })).to.be.true
      expect(exists.hasValue(node)).to.be.false
      expect(exists.hasValue({ ...node, value: null })).to.be.false
      expect(exists.hasValue({ ...node, value: undefined })).to.be.false
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
      ).to.equal('myValue')
    })
    it('If no value is provided, use $or', () => {
      expect(
        _.get(
          '$or.0.myField.$exists',
          exists.filter({
            field: 'myField',
          })
        )
      ).to.equal(false)
    })
  })
})
