const _ = require('lodash/fp')
let number = require('../../src/example-types/number')
let numberRangeHistogram = require('../../src/example-types/numberRangeHistogram')
let { expect } = require('chai')

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

    expect(!!numberRangeHistogram.hasValue(withMax)).to.be.true
    expect(!!numberRangeHistogram.hasValue(withoutMax)).to.be.false
  })
  it('should handle min', () => {
    let value = {
      type: 'number',
      field: 'test',
      min: 500,
    }
    let expectedValue = {
      range: {
        test: {
          gte: 500,
        },
      },
    }

    expect(number.filter(value)).to.deep.equal(expectedValue)

    expect(numberRangeHistogram.filter(value)).to.deep.equal(expectedValue)
  })
  it('should handle max', () => {
    let value = {
      type: 'number',
      field: 'test',
      max: 500,
    }
    let expectedValue = {
      range: {
        test: {
          lte: 500,
        },
      },
    }

    expect(number.filter(value)).to.deep.equal(expectedValue)

    expect(numberRangeHistogram.filter(value)).to.deep.equal(expectedValue)
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

    expect(numberRangeHistogram.filter(value)).to.deep.equal(expectedValue)
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
              stats: {
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
    let histogramDSL = {
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
            values: {
              histogram: {
                field: 'test',
                interval: 13,
                min_doc_count: 0,
              },
            },
          },
        },
      },
    }

    await number.result(value, esDSL => {
      expect(esDSL).to.deep.equal(expectedDSL)
    })

    await numberRangeHistogram.result(value, esDSL => {
      expect(_.isEqual(esDSL, expectedDSL) || _.isEqual(esDSL, histogramDSL)).to
        .be.true
    })
  })
})
