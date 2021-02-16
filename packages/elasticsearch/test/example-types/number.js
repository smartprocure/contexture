const _ = require('lodash/fp')
let number = require('../../src/example-types/number')
let { expect } = require('chai')

const lteExpectedValue = {
  range: {
    test: {
      lte: 500,
    },
  },
}

const gteExpectedValue = {
  range: {
    test: {
      gte: 500,
    },
  },
}

describe('number/filter', () => {
  it('should check for values', () => {
    let withMax = {
      type: 'number',
      field: 'test',
      max: 1000,
    }
    let withoutMax = {
      type: 'number',
      field: 'test',
    }
    expect(!!number.hasValue(withMax)).to.be.true
    expect(!!number.hasValue(withoutMax)).to.be.false
  })
  it('should handle min', () => {
    let value = {
      type: 'number',
      field: 'test',
      min: 500,
    }
    expect(number.filter(value)).to.deep.equal(gteExpectedValue)
  })
  it('should handle min with max as empty string', () => {
    let value = {
      type: 'number',
      field: 'test',
      min: 500,
      max: '',
    }
    expect(number.filter(value)).to.deep.equal(gteExpectedValue)
  })
  it('should handle min with max as null', () => {
    let value = {
      type: 'number',
      field: 'test',
      min: 500,
      max: null,
    }
    expect(number.filter(value)).to.deep.equal(gteExpectedValue)
  })
  it('should handle max', () => {
    let value = {
      type: 'number',
      field: 'test',
      max: 500,
    }
    expect(number.filter(value)).to.deep.equal(lteExpectedValue)
  })
  it('should handle max with min as empty string', () => {
    let value = {
      type: 'number',
      field: 'test',
      max: 500,
      min: '',
    }
    expect(number.filter(value)).to.deep.equal(lteExpectedValue)
  })
  it('should handle max with min as null', () => {
    let value = {
      type: 'number',
      field: 'test',
      max: 500,
      min: null,
    }
    expect(number.filter(value)).to.deep.equal(lteExpectedValue)
  })
  it('should handle min and max', () => {
    let value = {
      type: 'number',
      field: 'test',
      min: 500,
      max: 1000,
    }
    let expectedValue = {
      range: {
        test: {
          gte: 500,
          lte: 1000,
        },
      },
    }
    expect(number.filter(value)).to.deep.equal(expectedValue)
  })

  it('should produce proper results ES DSL', async () => {
    let value = {
      type: 'number',
      field: 'test',
      min: 500,
      max: 1000,
    }
    let expectedDSL = {
      aggs: {
        range_filter: {
          filter: {
            range: {
              test: {
                gte: 500,
                lte: 1000,
              },
            },
          },
          aggs: {
            statistical: {
              extended_stats: {
                field: 'test',
                missing: 0,
              },
            },
            all_percentiles: {
              percentiles: {
                field: 'test',
                percents: [0, 1, 99, 100],
              },
            },
          },
        },
      },
    }
    await number.result(value, esDSL => {
      expect(esDSL).to.deep.equal(expectedDSL)
    })
  })
})
