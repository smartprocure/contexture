let {expect} = require('chai'),
  mongoId = require('../src/default-types/mongoId'),
  mongoose = require('mongoose')

describe('mongoId', () => {
  it('should check for value', () => {
    expect(
      !!mongoId.hasValue({
        type: 'mongoId',
        field: 'test',
        data: {
          value: '53b46feb938d89315aae1477'
        }
      })
    ).to.be.true
    expect(
      !!mongoId.hasValue({
        type: 'mongoId',
        field: 'test',
        data: {}
      })
    ).to.be.false
  })
  it('should create filter for _id', () => {
    expect(
      mongoId.filter({
        field: '_id',
        data: {
          value: '53b46feb938d89315aae1477'
        }
      })
    ).to.deep.equal({
      _id: mongoose.Types.ObjectId('53b46feb938d89315aae1477')
    })
  })
})
