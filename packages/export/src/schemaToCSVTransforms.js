import _ from 'lodash/fp'
import { updateMany } from './futil'

// Maps contexture schemas to tranforms for fast-csv
export let schemaToCSVTransforms = (schema, logger = _.noop) => {
  let count = 0
  let headers = _.mapValues('label', schema)
  return {
    transformHeaders: key => headers[key] || _.startCase(key),
    // NOTE: for whatever reason you can't use a function declared
    // by _.flow as transaform not sure what fast-csv is doing under
    // the hood with it
    transform: row => _.flow(
      _.cond([
        [() => count === 0, x => x],
        [_.stubTrue, _.flow(
          updateMany(_.mapValues('display', schema)),
        )],
      ]),
      _.tap(record => logger(++count, record))
    )(row),
    writeHeaders: false
  }
}

// This is an example for testing, but could potentially be useful
export let schemaToCSVTransformsWithLogging = (
  schema,
  total,
  logger = console.info
) =>
  schemaToCSVTransforms(schema, count =>
    logger(`Records ${count} of ${total}`)
  )
