let { expect } = require('chai')
let _ = require('lodash/fp')
let exists = require('../../src/example-types/exists')

describe('exists', () => {
  describe('exists.filter', () => {
    it('If a value is provided, use $and', () => {
      expect(_.get('$and.0.myField.$exists', exists.filter({
        value: 'myValue',
        field: 'myField',
      }))).to.equal('myValue')
    })
    it('If no value is provided, use $or', () => {
      expect(_.get('$or.0.myField.$exists', exists.filter({
        field: 'myField',
      }))).to.equal(false)
    })
  })
})
