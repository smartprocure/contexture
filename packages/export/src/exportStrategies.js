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
export const formatValues = (
  rules = {},
  includedKeys = [],
  defaultDisplay = _.identity
) =>
  _.map(obj => {
    // Format all values of the passed in object
    let resultObject = F.mapValuesIndexed(
      (value, key) =>
        rules[key]
          ? (rules[key].display || defaultDisplay)(value)
          : defaultDisplay(value),
      obj
    )
    // Fill the empty properties for the objects missing the expected keys
    _.each(key => {
      if (!resultObject[key]) {
        resultObject[key] = ''
      }
    }, includedKeys)
    return resultObject
  })

// Format the column headers with passed rules or _.startCase
export const formatHeaders = (rules, defaultLabel = _.startCase) =>
  _.map(key =>
    _.has(`${key}.label`, rules) ? rules[key].label : defaultLabel(key)
  )

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
  let includedKeys = _.getOr([], 'include', strategy)
  let columnHeaders = formatHeaders(formatRules)(includedKeys)

  await onWrite({
    chunk: [],
    totalRecords,
  })

  let streamWrapper = {
    async write(chunk) {
      logger('CSVStream', `${records + chunk.length} of ${totalRecords}`)

      // Format the values in the current chunk with the passed in formatRules and fill any blank props
      let formattedData = formatValues(formatRules, includedKeys)(chunk)

      // If no includedKeys ware passed get them from the first row
      // this is not accurate and only works in the case where the first row has all the data for all columns
      if (_.isEmpty(columnHeaders)) {
        // Extract column names from first object and format them
        columnHeaders = formatHeaders(formatRules)(
          extractHeadersFromFirstRow(formattedData)
        )
      }

      // Convert data to CSV rows
      let rows = _.map(_.values, formattedData)

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
