var exists = require('../../src/example-types/exists')
let {expect} = require('chai')

describe('exists', () => {
  it('should filter properly', () => {
    expect(
      exists.filter({
        type: 'bool',
        field: 'test',
        data: {
          value: true
        }
      })
    ).to.deep.equal({
      exists: {
        field: 'test'
      }
    })
  })
  it('should filter properly if false', () => {
    expect(
      exists.filter({
        type: 'bool',
        field: 'test',
        data: {
          value: false
        }
      })
    ).to.deep.equal({
      bool: {
        must_not: {
          exists: {
            field: 'test'
          }
        }
      }
    })
  })
})
