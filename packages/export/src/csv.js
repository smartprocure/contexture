import csv from 'minimal-csv-formatter'
import _ from 'lodash/fp'

export let headerKeys = _.map(d => _.isString(d) ? d : _.keys(d)[0])
export let headerLabels = _.map(d => _.isString(d) ? d : _.values(d)[0])

//export writeCSV = ({
//  stream, // target stream
//  iterableData, // iterator for each page of an array of objects
//  headers, // [{ field1: 'Label' }, 'fieldA', { field2: 'Label 1' }], // ordered list of fields and/or field:label pairs
//  transformRecord, // function to transform each record
//  onWrite = _.noop // function to intercept writing a page of records
//}) => {
//    headers
//  let writeHeaders = _.once(data => {
//    if (!_.isNull(transformedHeaders)) {
//      csv.write(transformedHeaders)
//      return
//    }
//    let headers = props.headers || _.keys(data[0] || data)
//    csv.write(keysToObject(transformHeaders, headers))
//  })
//}
