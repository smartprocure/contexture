const chai = require('chai')
const sinon = require('sinon')
const F = require('futil')
const _ = require('lodash/fp')
const sinonChai = require('sinon-chai')
const types = require('../../src/example-types')

let { expect } = require('chai')

chai.use(sinonChai)

let sequentialResultTest = _.curry(
  async (getService, node, expectedResult, expectedCalls, schema = {}) => {
    let service

    if (_.isFunction(getService)) service = getService()
    else if (_.isArray(getService)) {
      service = sinon.stub()
      F.eachIndexed(
        (value, index) => service.onCall(index).returns(Promise.resolve(value)),
        getService
      )
    }
    let result = await types[node.type].result(
      _.defaults(
        {
          meta: {},
        },
        node
      ),
      service,
      schema
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

  testSchema: (field, notAnalyzedField = 'untouched') => ({
    fields: { [field]: { elasticsearch: { notAnalyzedField } } },
  }),
}
