/* eslint import/namespace: ['error', { allowComputed: true }] */

import F from 'futil'
import _ from 'lodash/fp.js'
import {vi, expect} from 'vitest'
import * as types from './index.js'

export let sequentialResultTest = _.curry(
  async (getService, node, expectedResult, expectedCalls, schema = {}) => {
    let service

    if (_.isFunction(getService)) service = getService()
    else if (_.isArray(getService)) {
      let calls = 0
      service = vi.fn(() => {
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

let toBe = (y) => (x) => expect(x).toBe(y)

export let validContexts = (type) => F.flowMap(type.validContext, toBe(true))

export let noValidContexts = (type) => F.flowMap(type.validContext, toBe(false))

export let hasValueContexts = (type) => F.flowMap(type.hasValue, toBe(true))

export let noValueContexts = (type) => F.flowMap(type.hasValue, toBe(false))

export let testSchema = (field, notAnalyzedField = 'untouched') => ({
  fields: { [field]: { elasticsearch: { notAnalyzedField } } },
})

export let testSchemas = (fields, notAnalyzedField = 'untouched') => ({
  fields: _.reduce(
    (result, field) => ({
      [field]: { elasticsearch: { notAnalyzedField } },
      ...result,
    }),
    {},
    fields
  ),
})
