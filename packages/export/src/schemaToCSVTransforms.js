import _ from 'lodash/fp'
import { updateMany } from './futil'

// Maps contexture schemas to tranforms for fast-csv
export let schemaToCSVTransforms = (schema, {logger = _.noop, header = true, include } = {}) => {
  let count = 0
  let headers = _.mapValues('label', schema)
  return {
    transformHeaders: key => headers[key] || _.startCase(key),
    // NOTE: for whatever reason you can't use a function declared
    // by _.flow as transaform, just `transform: _.identity` works as expected
    // but `transform: _.flow(_.identity)` does write a csv and doesn't throw any errors :(
    // _.flow might be hitting the fast-csv callback api for transform but not really sure
    transform: row => _.flow(
      include ? _.pick(include) : _.identity,
      _.cond([
        [() => header && count === 0, x => x], // don't format the header
        [_.stubTrue, _.flow(
          updateMany(_.mapValues('display', schema)),
        )],
      ]),
      _.tap(record => logger(count, record)),
      _.tap(() => count++),
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
  schemaToCSVTransforms(schema, {
    logger: count => logger(`Records ${count} of ${total}`)
  })
