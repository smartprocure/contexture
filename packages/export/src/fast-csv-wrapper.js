import _ from 'lodash/fp'
import { format as formatCSV } from '@fast-csv/format'
import { keysToObject } from './futil'
import { isIterable, isAsyncIterable } from './utils'

export let format = ({ transformHeaders = x => x, onWrite = _.noop, includeEndRowDelimiter = true, ...props }) => {
  let csv = formatCSV({...props, headers: true, includeEndRowDelimiter})
  let records = 0

  // Write headers as data since fast-csv doesn't support transformHeaders natively yet
  // If headers are ['a', 'b'], write a record like this: `{ a : transformHeaders('a'), b: transformHeaders('b') }`
  let writeHeaders = _.once(data => {
    let headers = props.headers || _.keys(data[0] || data)
    csv.write(keysToObject(transformHeaders, headers))
  })
  
  // object array support
  let writeRecordOrRecords = data => {
    writeHeaders(data)
    if (_.isArray(data) && _.isPlainObject(data[0]))
      _.each(record => csv.write(record), data)
    else csv.write(data)
  }
  return {
    pipe: x => csv.pipe(x),
    end: () => csv.end(),
    write: async data => {
      // asyncIterator support
      if (isAsyncIterable(data))
        for await (let item of data)
          writeRecordOrRecords(item)

      // iterator support
      else if (isIterable(data))
        for (let item of data)
          writeRecordOrRecords(item)

      // default
      else writeRecordOrRecords(data)

      // TODO double check data.length works as expected for
      // both iterator types
      records = records + data.length
      await onWrite({ records })
    },
  }
}

export let writeToStream =  async (stream, data, config) => {
  let csv = format(config)
  csv.pipe(stream)
  await csv.write(data)
  csv.end()
}
