import F from 'futil'
import _ from 'lodash/fp'

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

// Format object values based on passed formatter or _.identity
// Also fill in any keys which are present in the included keys but not in the passed in object
export const formatValues = (rules = {}, includeKeys = []) => {
  let defaults = _.flow(
    _.map(x => [x, '']),
    _.fromPairs
  )(includeKeys)

  return _.map(
    _.flow(
      F.flattenObject,
      F.mapValuesIndexed((value, key) =>
        _.getOr(_.identity, [key, 'display'], rules)(value)
      ),
      _.defaults(defaults)
    )
  )
}

// Format the column headers with passed rules or _.startCase
export const formatHeaders = (rules, defaultLabel = _.startCase) =>
  _.map(key => _.get([key, 'label'], rules) || defaultLabel(key))

// Extract keys from first row
export let extractHeadersFromFirstRow = _.flow(
  _.first,
  _.keys
)

// Escape quotes and quote cell
let transformCell = _.flow(
  _.replace(/"/g, '""'),
  x => `"${x}"`
)

let transformRow = _.flow(
  _.map(transformCell),
  _.join(',')
)

// Convert array of objects to array of arrays
export let convertData = (data, keys) => {
  // Extract data from object
  let transformRow = row => _.map(key => _.get(key, row), keys)
  return _.map(transformRow, data)
}

export let rowsToCSV = _.flow(
  _.map(transformRow),
  _.join('\n'),
  x => `${x}\n`
)

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
  let includeKeys = _.getOr([], 'include', strategy)
  let columnHeaders = formatHeaders(formatRules)(includeKeys)

  await onWrite({
    chunk: [],
    totalRecords,
  })

  let streamWrapper = {
    async write(chunk) {
      logger('CSVStream', `${records + chunk.length} of ${totalRecords}`)

      // If no includeKeys ware passed get them from the first row.
      // This only works in the case where the first row has all the data for all columns
      if (_.isEmpty(includeKeys)) {
        // Extract column names from first object
        includeKeys = extractHeadersFromFirstRow(chunk)
        // Format column headers
        columnHeaders = formatHeaders(formatRules)(includeKeys)
      }

      // Format the values in the current chunk with the passed in formatRules and fill any blank props
      let formattedData = formatValues(formatRules, includeKeys)(chunk)

      // Convert data to CSV rows
      let rows = convertData(formattedData, includeKeys)

      // Prepend column headers on first pass
      if (!records) {
        rows = [columnHeaders, ...rows]
      }

      // Convert rows to a single CSV string
      let csv = rowsToCSV(rows)

      records += chunk.length
      await targetStream.write(csv)
      await onWrite({
        chunk: formattedData,
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
