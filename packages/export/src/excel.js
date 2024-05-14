import _ from 'lodash/fp.js'
import writeXlsxFile from 'write-excel-file/node'

const convertToExcelCell = (value) => {
  return {
    type: String,
    typeof: 'string',
    wrap: true,
    value: `${value}`,
  }
}

let transformLabels = _.map(_.get('label'))

export default ({
  stream, // writable stream target stream
  iterableData, // iterator for each page of an array of objects
  // order list of which indicates the header label,
  // display function for the field,
  // and key of the record.
  // [{ key: string(supports lodash dot notation), label: string, display: function(value, {key, record, transform})}...]
  transform,
  headers = null, // array of strings to use as headers, array or arrays for multi-line headers
  onWrite = _.noop, // function to intercept writing a page of records
}) => {
  const excelData = [
    _.map(
      (value) => ({ value, fontWeight: 'bold' }),
      headers || transformLabels(transform)
    ),
  ]

  let cancel = false
  let recordsWritten = 0

  return {
    promise: (async () => {
      for await (let r of iterableData) {
        if (cancel) break
        excelData.push(
          _.map(
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
        )
        recordsWritten = recordsWritten + _.getOr(1, 'recordCount', r)
        await onWrite({ recordsWritten })
      }
      let columns = _.map(
        () => ({
          width: 50,
        }),
        excelData[1]
      )
      const readStream = await writeXlsxFile(excelData, { columns })
      for await (const chunk of readStream) {
        stream.write(chunk)
      }
      await onWrite({ recordsWritten: recordsWritten, isStreamDone: true })
      await stream.end()
    })(),
    cancel() {
      cancel = true
    },
  }
}
