import _ from 'lodash/fp'
import * as F from 'futil-js'
import { mapAsync } from './util/promise'

export let defaultHasValue = x => !F.isBlankDeep(_.some)(x.data)
// Aync fn to inspect types.
// ASYNC runValidate: return true -> proceed, return false -> exclude, throw -> error!
export let validate = _.curry(async (runValidate, extend, child) => {
  delete child.error //?? might need to be on mutate only in case of server error?
  try {
    if (child.children) await mapAsync(validate(runValidate, extend), child.children)
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
