let { expect } = require('chai')
let mongoId = require('../../src/example-types/mongoId')
let ObjectID = require('mongodb').ObjectID

describe('mongoId', () => {
  it('should check for value', () => {
    expect(
      !!mongoId.hasValue({
        type: 'mongoId',
        field: 'test',
        value: '53b46feb938d89315aae1477',
      })
    ).to.be.true
    expect(
      !!mongoId.hasValue({
        type: 'mongoId',
        field: 'test',
      })
    ).to.be.false
  })
  it('should create filter for _id', () => {
    expect(
      mongoId.filter({
        field: '_id',
        value: '53b46feb938d89315aae1477',
      })
    ).to.deep.equal({
      _id: {
        $in: [new ObjectID('53b46feb938d89315aae1477')],
      },
    })
  })
  it('should handle $in with a data.values array', () => {
    expect(
      mongoId.filter({
        field: '_id',
        values: ['53b46feb938d89315aae1477'],
      })
    ).to.deep.equal({
      _id: {
        $in: [new ObjectID('53b46feb938d89315aae1477')],
      },
    })
  })
  it('should handle $in with a data.values array', () => {
    expect(
      mongoId.filter({
        field: '_id',
        mode: 'exclude',
        values: ['53b46feb938d89315aae1477'],
      })
    ).to.deep.equal({
      _id: {
        $nin: [new ObjectID('53b46feb938d89315aae1477')],
      },
    })
  })
})
