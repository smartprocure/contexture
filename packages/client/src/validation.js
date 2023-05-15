import _ from 'lodash/fp.js'
import F from 'futil'

// Aync fn to inspect types.
// ASYNC runValidate: return true -> proceed, return false -> exclude, throw -> error!
export let validate = _.curry(async (runValidate, actionProps, child) => {
  let { extend } = actionProps
  extend(child, { error: null })
  try {
    if (child.children)
      await F.flowAsync(_.map)(
        validate(runValidate, actionProps),
        child.children
      )
    let hasValue = child.children
      ? _.some('hasValue', child.children)
      : await runValidate(child, actionProps)
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
