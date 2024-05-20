import _ from 'lodash/fp.js'
import F from 'futil'
import writeXlsxFile from 'write-excel-file/node'

const convertToExcelCell = (value) => {
  return {
    wrap: true,
    value: value ? `${value}` : ``,
  }
}

export const writeStreamData = async (stream, writeStreamData) => {
  const readStream = await writeStreamData()
  for await (const chunk of readStream) {
    stream.write(chunk)
  }
}

let transformLabels = _.map(_.get('label'))
let maxColumnWidth = 200

export default ({
  stream, // writable stream target stream
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
      (value) => ({ value, fontWeight: 'bold', backgroundColor: '#999999' }),
      headers || transformLabels(transform)
    ),
  ]

  let cancel = false
  let recordsWritten = 0
  let columnWidths = _.map(
    (column) => ({ width: column.value.length }),
    excelData[0]
  )

  return {
    promise: (async () => {
      for await (let r of iterableData) {
        if (cancel) break
        let row = _.map(
          (t) =>
            convertToExcelCell(
              t.display(_.get(t.key, r), {
                key: t.key,
                record: r,
                transform,
              })
            ),
          transform
        )
        columnWidths = F.mapIndexed(
          (value, index) => ({
            width: Math.min(
              Math.max(value.width, row[index].value.length),
              maxColumnWidth
            ),
          }),
          columnWidths
        )
        excelData.push(row)
        recordsWritten = recordsWritten + _.getOr(1, 'recordCount', r)
        await onWrite({ recordsWritten })
      }
      await writeStreamData(
        stream,
        async () =>
          await writeXlsxFile(excelData, {
            columns: columnWidths,
            stickyRowsCount: 1,
          })
      )
      await onWrite({ recordsWritten, isStreamDone: true })
      await stream.end()
    })(),
    cancel() {
      cancel = true
    },
  }
}
