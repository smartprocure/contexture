let bool = require('../../src/example-types/bool')
let {expect} = require('chai')

describe('bool', function() {
  it('should filter properly', function() {
    expect(
      bool.filter({
        type: 'bool',
        field: 'test',
        data: {
          value: true
        }
      })
    ).to.deep.equal({
      term: {
        test: true
      }
    })
  })
  it('should filter properly if false', function() {
    expect(
      bool.filter({
        type: 'bool',
        field: 'test',
        data: {
          value: false
        }
      })
    ).to.deep.equal({
      term: {
        test: false
      }
    })
  })
})
