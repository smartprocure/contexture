import csv from 'minimal-csv-formatter'
import _ from 'lodash/fp.js'

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
  stream.write(csv(headers || transformLabels(transform)))

  let cancel = false
  let recordsWritten = 0

  return {
    promise: (async () => {
      for await (let r of iterableData) {
        if (cancel) break
        stream.write(
          csv(
            _.map(
              (t) =>
                t.display(_.get(t.key, r), {
                  key: t.key,
                  record: r,
                  transform,
                }),
              transform
            )
          )
        )
        recordsWritten = recordsWritten + _.getOr(1, 'recordCount', r)
        onWrite({ recordsWritten, record: r })
      }
      await stream.end()
    })(),
    cancel() {
      cancel = true
    },
  }
}
