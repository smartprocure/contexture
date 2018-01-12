const chai = require('chai')
const sinon = require('sinon')
const Promise = require('bluebird')
const F = require('futil-js')
const _ = require('lodash/fp')
const sinonChai = require('sinon-chai')
const types = require('../../src/example-types/__all')

let { expect } = require('chai')

chai.use(sinonChai)

let EsProcessor = {
  config: {
    request: {
      defaultShardSize: 12500, // Used by terms_stats
      accuracyShardSize: 5000, // Used by faces
    },
  },
}

let sequentialResultTest = _.curry(
  async (getService, context, expectedResult, expectedCalls, schema = {}) => {
    let service

    if (_.isFunction(getService)) service = getService()
    else if (_.isArray(getService)) {
      service = sinon.stub()
      F.eachIndexed(
        (value, index) => service.onCall(index).returns(Promise.resolve(value)),
        getService
      )
    }

    let result = await types[context.type].result(
      _.defaults(
        {
          meta: {},
        },
        context
      ),
      service,
      schema,
      EsProcessor
    )

    expect(result).to.deep.equal(expectedResult)

    expect(service).to.have.callCount(expectedCalls.length)

    // Can't use sinon-chai-in-order as it doesn't do deep equality with diffs
    F.eachIndexed(
      (input, index) =>
        expect(service.getCall(index).args[0]).to.deep.equal(input),
      expectedCalls
    )
  }
)

module.exports = {
  validContexts: type => F.flowMap(type.validContext, chai.assert.isTrue),
  noValidContexts: type => F.flowMap(type.validContext, chai.assert.isFalse),
  hasValueContexts: type => F.flowMap(type.hasValue, chai.assert.isTrue),
  noValueContexts: type => F.flowMap(type.hasValue, chai.assert.isFalse),
  sequentialResultTest,
}
