import _ from 'lodash/fp.js'
import F from 'futil'
import writeXlsxFile from 'write-excel-file/node'

let transformLabels = _.map(_.get('label'))
let maxColumnWidth = 200
let headerBackgroundColor = '#999999'
let indexColumnBackgroundColor = '#bbbbbb'

const convertToExcelCell = (value, index) => {
  if (value?.meta?.__isHyperlink) {
    const excelSafeUrl = value?.url?.replace(/"/g, '""') || ''
    const displayValue = value?.meta?.__alias || excelSafeUrl || ''
    return {
      value: `HYPERLINK("${excelSafeUrl}", "${displayValue}")`,
      type: 'Formula',
      wrap: true,
    }
  }
  return {
    wrap: true,
    value: value ? `${value}` : ``,
    ...((index === 0 && { backgroundColor: indexColumnBackgroundColor }) || {}),
  }
}

export default ({
  stream, // writable stream target stream
  readStreamData = async (data, options) => await writeXlsxFile(data, options),
  iterableData, // iterator for each page of an array of objects
  // order list of which indicates the header label,
  // display function for the field,
  // and key of the record.
  // [{ key: string(supports lodash dot notation), label: string, display: function(value, {key, record, transform})}...]
  transform,
  //TODO: support multi-line headers in excel and csv when implemented
  headers = null, // array of strings to use as headers
  onWrite = _.noop, // function to intercept writing a page of records
}) => {
  const excelData = [
    _.map(
      (value) => ({
        value,
        fontWeight: 'bold',
        backgroundColor: headerBackgroundColor,
      }),
      headers || transformLabels(transform)
    ),
  ]

  let cancel = false
  let recordsWritten = 0
  let columns = _.map(
    (column) => ({ width: column.value.length }),
    excelData[0]
  )

  return {
    promise: (async () => {
      for await (let r of iterableData) {
        if (cancel) break
        let row = F.mapIndexed(
          (data, index) =>
            convertToExcelCell(
              data.display(_.get(data.key, r), {
                key: data.key,
                record: r,
                transform,
              }),
              index
            ),
          transform
        )
        columns = F.mapIndexed(
          (value, index) => ({
            width: Math.min(
              Math.max(value.width, row[index].value.length),
              maxColumnWidth
            ),
          }),
          columns
        )
        excelData.push(row)
        recordsWritten = recordsWritten + _.getOr(1, 'recordCount', r)
        await onWrite({ recordsWritten })
      }

      const readStream = await readStreamData(excelData, {
        columns,
        stickyRowsCount: 1,
      })
      for await (const chunk of readStream) {
        stream.write(chunk)
      }

      await onWrite({ recordsWritten, isStreamDone: true })
      await stream.end()
    })(),
    cancel() {
      cancel = true
    },
  }
}
