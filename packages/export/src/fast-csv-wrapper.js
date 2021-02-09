import _ from 'lodash/fp'
import { format as formatCSV } from '@fast-csv/format'
import { keysToObject } from './futil'
import { isIterable, isAsyncIterable } from './utils'

export let format = ({ transformHeaders = x => x, transformedHeaders = null, onWrite = _.noop, includeEndRowDelimiter = true, ...props }) => {
  let csv = formatCSV({...props, headers: true, includeEndRowDelimiter})
  let records = 0

  // Write headers as data since fast-csv doesn't support transformHeaders natively yet
  // If headers are ['a', 'b'], write a record like this: `{ a : transformHeaders('a'), b: transformHeaders('b') }`
  let writeHeaders = _.once(data => {
    if (!_.isNull(transformedHeaders)) {
      csv.write(transformedHeaders)
      return
    }
    let headers = props.headers || _.keys(data[0] || data)
    csv.write(keysToObject(transformHeaders, headers))
  })

  // object array support
  // return the number of records written
  let writeRecordOrRecords = data => {
    writeHeaders(data)
    if (_.isArray(data) && _.isPlainObject(data[0])) {
      _.each(record => csv.write(record), data)
      return data.length
    } else {
      csv.write(data)
      return 1
    }
  }

  let callOnWrite = _.throttle(
    1000, // update at most once a second
    () => onWrite({ records })
  )

  return {
    pipe: x => csv.pipe(x),
    end: () => csv.end(),
    async write(data) {
      // asyncIterator support
      if (isAsyncIterable(data))
        for await (let item of data) {
          records = records + writeRecordOrRecords(item)
          await callOnWrite()
        }

      // iterator support
      else if (isIterable(data))
        for (let item of data) {
          records = records + writeRecordOrRecords(item)
          await callOnWrite()
        }

      // default
      else {
        records = records + writeRecordOrRecords(data)
        await callOnWrite()
      }

      await callOnWrite.flush()
    },
  }
}

export let writeToStream =  async (stream, data, config) => {
  let csv = format(config)
  csv.pipe(stream)
  await csv.write(data)
  csv.end()
}
