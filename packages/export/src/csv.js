import csv from 'minimal-csv-formatter'
import _ from 'lodash/fp'

export let headerKeys = _.map(d => _.isObject(d) ? d.key : d)
export let headerLabels = _.map(d => {
  if (_.isObject(d))
    return _.isNil(d.label) ? d.key : d.label
  return d
})

export let writeCSV = ({
  stream, // writable stream target stream
  iterableData, // iterator for each page of an array of objects
  transformAndHeaders, // [{ field1: 'Label' }, 'fieldA', { field2: 'Label 1' }], // ordered list of fields and/or field:label pairs
  defaultTransform = _.identity,
  onWrite = _.noop, // function to intercept writing a page of records
}) => {
  stream.write(csv(headerLabels(transformAndHeaders)))
  stream.end()
}
