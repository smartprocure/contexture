let {
  hasValue,
  filter,
  buildQuery,
} = require('../../../src/example-types/filters/number')
let { expect } = require('chai')

let lteExpectedValue = { range: { test: { lte: 500 } } }
let gteExpectedValue = { range: { test: { gte: 500 } } }

describe('number/filter', () => {
  it('should check for values', () => {
    let withMax = { type: 'number', field: 'test', max: 1000 }
    let withoutMax = { type: 'number', field: 'test' }
    expect(!!hasValue(withMax)).to.be.true
    expect(!!hasValue(withoutMax)).to.be.false
  })
  it('should handle min', () => {
    let value = { type: 'number', field: 'test', min: 500 }
    expect(filter(value)).to.deep.equal(gteExpectedValue)
  })
  it('should handle min with max as empty string', () => {
    let value = { type: 'number', field: 'test', min: 500, max: '' }
    expect(filter(value)).to.deep.equal(gteExpectedValue)
  })
  it('should handle min with max as null', () => {
    let value = { type: 'number', field: 'test', min: 500, max: null }
    expect(filter(value)).to.deep.equal(gteExpectedValue)
  })
  it('should handle max', () => {
    let value = { type: 'number', field: 'test', max: 500 }
    expect(filter(value)).to.deep.equal(lteExpectedValue)
  })
  it('should handle max with min as empty string', () => {
    let value = { type: 'number', field: 'test', max: 500, min: '' }
    expect(filter(value)).to.deep.equal(lteExpectedValue)
  })
  it('should handle max with min as null', () => {
    let value = { type: 'number', field: 'test', max: 500, min: null }
    expect(filter(value)).to.deep.equal(lteExpectedValue)
  })
  it('should handle min and max', () => {
    let value = { type: 'number', field: 'test', min: 500, max: 1000 }
    let expectedValue = { range: { test: { gte: 500, lte: 1000 } } }
    expect(filter(value)).to.deep.equal(expectedValue)
  })

  it('should produce proper results ES DSL', async () => {
    let value = { type: 'number', field: 'test', min: 500, max: 1000 }
    let expectedDSL = {
      aggs: {
        rangeFilter: {
          filter: { range: { test: { gte: 500, lte: 1000 } } },
          aggs: {
            percentiles: {
              percentiles: { field: 'test', percents: [0, 1, 99, 100] },
            },
          },
        },
      },
    }
    let output = buildQuery(value.field, value.min, value.max, 1)
    expect(output).to.deep.equal(expectedDSL)
  })
})
