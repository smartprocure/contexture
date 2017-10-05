let number = require('../../src/example-types/number')
let {expect} = require('chai')
describe('number/filter', () => {
  it('should check for values', () => {
    expect(
      !!number.hasValue({
        type: 'number',
        field: 'test',
        data: {
          max: 1000
        }
      })
    ).to.be.true
    expect(
      !!number.hasValue({
        type: 'number',
        field: 'test',
        data: {}
      })
    ).to.be.false
  })
  it('should handle min', () => {
    expect(
      number.filter({
        type: 'number',
        field: 'test',
        data: {
          min: 500
        }
      })
    ).to.deep.equal({
      range: {
        test: {
          gte: 500
        }
      }
    })
  })
  it('should handle max', () => {
    expect(
      number.filter({
        type: 'number',
        field: 'test',
        data: {
          max: 500
        }
      })
    ).to.deep.equal({
      range: {
        test: {
          lte: 500
        }
      }
    })
  })
  it('should handle min and max', () => {
    expect(
      number.filter({
        type: 'number',
        field: 'test',
        data: {
          min: 500,
          max: 1000
        }
      })
    ).to.deep.equal({
      range: {
        test: {
          gte: 500,
          lte: 1000
        }
      }
    })
  })
})
