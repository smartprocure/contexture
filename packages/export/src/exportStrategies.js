import F from 'futil'
import _ from 'lodash/fp'
import ObjectsToCsv from 'objects-to-csv'

// Paged export strategy,
// it will continuously call getNext until hasNext returns false.
// Each time it calls getNext, it will send each one of the results to the onChange function.
export const paged = _.curry(async ({ strategy, onChange }) => {
  while (strategy.hasNext()) {
    let result = await strategy.getNext()
    if (_.isEmpty(result)) return
    await onChange(result)
  }
})

// Bulk export strategy,
// it will retrieve all the data available using the paged export strategy
// into an array in memory, which will be returned once it finishes.
export const bulk = _.curry(async ({ strategy }) => {
  let result = []
  await paged({
    strategy,
    onChange(data) {
      result = result.concat(data)
    },
  })
  return result
})

// Stream export strategy,
// it will call the paged export strategy with stream.write as the onChange function.
// When it finishes, it will close the stream with stream.end().
export const stream = _.curry(async ({ strategy, stream }) => {
  await paged({
    strategy,
    onChange: stream.write,
  })
  stream.end()
})

// Strategies with a custom formatter

// This format function breaks down an array of plain objects into key value pairs,
// which will be formatted using the given format rules,
// which then will return the array of formatted plain objects.
// If the format rules doesn't have a proper way to handle certain key/value pair,
// it will resort to the defaultLabel and defaultDisplay parameters, which by default
// change the key to be in startCase form (so "ABCDary" becomes "ABC Dary"), and keeps the value as is.
const format = (
  rules,
  defaultLabel = _.startCase,
  defaultDisplay = _.identity
) => {
  let propertyFormatter = _.map(
    ([k, v]) =>
      rules[k]
        ? [
            rules[k].label || defaultLabel(k),
            (rules[k].display || defaultDisplay)(v),
          ]
        : [defaultLabel(k), defaultDisplay(v)]
  )
  return _.map(
    _.flow(
      F.flattenObject,
      _.toPairs,
      propertyFormatter,
      _.fromPairs
    )
  )
}

// CSVStream is an export strategy that uses the stream strategy,
// but customizes each of the data chunks using the provided formatRules through the format function above.
export const CSVStream = async ({
  strategy,
  stream: targetStream,
  onWrite,
  formatRules = {},
  logger = console.info,
}) => {
  let records = 0
  let totalRecords = await strategy.getTotalRecords()

  await onWrite({
    chunk: [],
    totalRecords,
  })

  let streamWrapper = {
    async write(chunk) {
      logger('CSVStream', `${records + chunk.length} of ${totalRecords}`)

      chunk = format(formatRules)(chunk)
      let csv = await new ObjectsToCsv(chunk).toString()

      // Records will have a truthy value if we're not on the first
      // page. When that's the case, we want to remove the header of the CSV
      // so that it doesn't appear multiple times throughout the file.
      if (records)
        csv = csv
          .split('\n')
          .slice(1)
          .join('\n')

      records += chunk.length
      await targetStream.write(csv)
      await onWrite({
        chunk,
        records,
        totalRecords,
      })
    },
    end() {
      targetStream.end()
    },
  }
  await stream({ strategy, stream: streamWrapper })
}
