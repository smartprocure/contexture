import _ from 'lodash/fp'
import { transformat } from '../futil'

// Maps contexture schemas to tranforms for fast-csv
export let schemaToCSVTransforms = schema => {
  let headers = _.mapValues('label', schema)
  return {
    transformHeaders: key => headers[key] || _.startCase(key),
    transform: transformat(_.mapValues('display', schema))
  }
}

// This is an example for testing, but could potentially be useful
export let schemaToCSVTransformsWithLogging = async (
  schema,
  total,
  logger = console.info
) => {
  let count = 0
  let headers = _.mapValues('label', schema)
  return {
    transformHeaders: key => headers[key] || _.startCase(key),
    // Not sure why currying doesn't work :think:
    transform: _.flow(
      _.tap(() => logger(`Records ${++count} of ${total}`)),
      transformat(_.mapValues('display', schema))
    ),
  }
}
