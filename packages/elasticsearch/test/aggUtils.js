let aggUtils = require('../src/aggUtils'),
  {expect} = require('chai')

describe('aggUtils', () => {
  it('buildAgg should work', () => {
    expect(
      aggUtils.buildAgg({
        key: 'key',
        type: 'type',
        field: 'field',
        data: {someData: true}
      })
    ).to.eql({
      key: {
        type: {
          field: 'field',
          someData: true
        }
      }
    })
    expect(
      aggUtils.buildAgg({
        type: 'type',
        field: 'field',
        data: {someData: true}
      })
    ).to.eql({
      type: {
        type: {
          field: 'field',
          someData: true
        }
      }
    })
  })
  it('buildFilter should work', () => {
    expect(
      aggUtils.buildFilter({
        type: 'type',
        field: 'field',
        data: {someData: true}
      })
    ).to.eql({
      type: {
        field: {
          someData: true
        }
      }
    })
  })
})
