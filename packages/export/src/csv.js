import csv from 'minimal-csv-formatter'
import _ from 'lodash/fp'

export let headerKeys = _.map(d => _.isObject(d) ? _.keys(d)[0] : d)
export let headerLabels = _.map(d => {
  if (_.isObject(d))
    return _.values(d)[0].label || _.keys(d)[0]
  return d
})

//export writeCSV = ({
//  stream, // target stream
//  iterableData, // iterator for each page of an array of objects
//  headers, // [{ field1: 'Label' }, 'fieldA', { field2: 'Label 1' }], // ordered list of fields and/or field:label pairs
//  transformRecord, // function to transform each record
//  onWrite = _.noop // function to intercept writing a page of records
//}) => {
//    stream.write(csv(headerLabels(headers)))
//    let keys = headerKeys(headers)
//
//  })
//}
