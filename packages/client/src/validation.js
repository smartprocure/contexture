import _ from 'lodash/fp'
import * as F from 'futil-js'
import { mapAsync } from './util/promise'

export let defaultHasValue = x => !F.isBlankDeep(_.some)(x.data)
// Aync fn to inspect types.
// ASYNC runValidate: return true -> proceed, return false -> exclude, throw -> error!
export let validate = runValidate => {
  let validateLeaf = async child => {
    try {
      delete child.error //?? might need to be on mutate only in case of server error?
      return (child.hasValue = await runValidate(child))
    } catch (e) {
      child.hasValue = false
      child.error = e
      throw e
    }
  }
  
  let validateGroup = async child => {
    if (child.children) {
      await mapAsync(validateGroup, child.children)
      return child.hasValue = _.some('hasValue', child.children)
    }
    else return validateLeaf(child)
  }

  return {
    validateGroup,
  }
}
