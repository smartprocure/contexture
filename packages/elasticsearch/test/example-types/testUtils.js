const F = require('futil')
const _ = require('lodash/fp')
const types = require('../../src/example-types')

let sequentialResultTest = _.curry(
  async (getService, node, expectedResult, expectedCalls, schema = {}) => {
    let service

    if (_.isFunction(getService)) service = getService()
    else if (_.isArray(getService)) {
      let calls = 0
      service = jest.fn(() => {
        calls++
        return Promise.resolve(getService[calls - 1])
      })
      // F.eachIndexed(
      //   (value, index) => service.onCall(index).returns(Promise.resolve(value)),
      //   getService
      // )
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

    expect(result).toEqual(expectedResult)

    expect(service).toBeCalledTimes(expectedCalls.length)

    F.eachIndexed(
      (input, index) => expect(service.mock.calls[index][0]).toEqual(input),
      expectedCalls
    )
  }
)

let toBe = y => x => expect(x).toBe(y)

module.exports = {
  validContexts: type => F.flowMap(type.validContext, toBe(true)),
  noValidContexts: type => F.flowMap(type.validContext, toBe(false)),
  hasValueContexts: type => F.flowMap(type.hasValue, toBe(true)),
  noValueContexts: type => F.flowMap(type.hasValue, toBe(false)),
  sequentialResultTest,

  testSchema: (field, notAnalyzedField = 'untouched') => ({
    fields: { [field]: { elasticsearch: { notAnalyzedField } } },
  }),
  testSchemas: (fields, notAnalyzedField = 'untouched') => ({
    fields: _.reduce(
      (result, field) => ({
        [field]: { elasticsearch: { notAnalyzedField } },
        ...result,
      }),
      {},
      fields
    ),
  }),
}
