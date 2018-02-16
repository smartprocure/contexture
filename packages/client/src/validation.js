import _ from 'lodash/fp'
import * as F from 'futil-js'
import { mapAsync } from './util/promise'

export let defaultHasValue = x => !F.isBlankDeep(_.some)(x.data)
// Aync fn to inspect types.
// ASYNC runValidate: return true -> proceed, return false -> exclude, throw -> error!
export let validate = _.curry(async (runValidate, child) => {
  child.error = null
  try {
    if (child.children)
      await mapAsync(validate(runValidate), child.children)
    let hasValue = child.children
      ? _.some('hasValue', child.children)
      : await runValidate(child)
    child.hasValue = hasValue
    return hasValue
  } catch (error) {
    child.hasValue = false
    child.error = error
    throw error
  }
})
