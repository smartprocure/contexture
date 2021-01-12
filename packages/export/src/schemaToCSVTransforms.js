import _ from 'lodash/fp'
import { updateMany } from './futil'

// Maps contexture schemas to tranforms for fast-csv
export let schemaToCSVTransforms = (schema, logger = _.noop) => {
  let count = 0
  let headers = _.mapValues('label', schema)
  return {
    transformHeaders: key => headers[key] || _.startCase(key),
    transform: _.flow(
      _.tap(record => logger(++count, record)),
      updateMany(_.mapValues('display', schema))
    ),
  }
}

// This is an example for testing, but could potentially be useful
export let schemaToCSVTransformsWithLogging = (
  schema,
  total,
  logger = console.info
) =>
  schemaToCSVTransforms2(schema, count =>
    logger(`Records ${count} of ${total}`)
  )
