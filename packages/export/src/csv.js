import csv from 'minimal-csv-formatter'
import _ from 'lodash/fp'

let transformLabels = _.map(_.get('label'))

export default ({
  stream, // writable stream target stream
  iterableData, // iterator for each page of an array of objects
  // order list of which indicates the header label,
  // display function for the field,
  // and key of the record.
  // [{ key: string, label: string, dispaly: funciton}...]
  transform,
  onWrite = _.noop, // function to intercept writing a page of records
}) => {
  stream.write(csv(transformLabels(transform)))
  let cancel = false
  let recordsWritten = 0

  return {
    promise: (async () => {
      for await (let r of iterableData) {
        if (cancel) break
        stream.write(csv(_.map(t => t.display(r[t.key]), transform)))
        recordsWritten = recordsWritten + 1
        onWrite({ recordsWritten, record: r })
      }
      await stream.end()
    })(),
    cancel() {
      cancel = true
    },
  }
}
