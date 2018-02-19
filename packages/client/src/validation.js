import _ from 'lodash/fp'
import * as F from 'futil-js'
import { mapAsync } from './util/promise'

export let defaultHasValue = _.flow(
  F.cascade(['data', 'values', 'value', 'query']),
  F.overNone([
    F.isBlankDeep(_.some),
    x => _.isArray(x) ? _.isEmpty(x) : _.isNil(x),
  ])
)

// Aync fn to inspect types.
// ASYNC runValidate: return true -> proceed, return false -> exclude, throw -> error!
export let validate = _.curry(async (runValidate, extend, child) => {
  extend(child, { error: null })
  try {
    if (child.children)
      await mapAsync(validate(runValidate, extend), child.children)
    let hasValue = child.children
      ? _.some('hasValue', child.children)
      : await runValidate(child)
    extend(child, { hasValue })
    return hasValue
  } catch (error) {
    extend(child, {
      hasValue: false,
      error,
    })
    throw error
  }
})
