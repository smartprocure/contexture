import _ from 'lodash/fp'
import { PassThrough } from 'stream'
import csv from './csv'

let mockFileStream = () => {
  let writeStream = new PassThrough()
  let fileData = new Promise((res, rej) => {
    let data = []
    writeStream.on('data', d => data.push(d.toString()))
    writeStream.on('end', () => res(_.join('', data)))
    writeStream.on('error', rej)
  })
  return { writeStream, fileData }
}

let iterableData = [
  { name: 'record1', value: 1, nestedValue: { value: 'a' } },
  { name: 'record2', value: 2, nestedValue: { value: 'b' } },
  { name: 'record3', value: 3, nestedValue: { value: 'c' } },
]

let expectedFileContents = `\
"THE,NAME",Value,Value RecordName Key TransformLength
Record1,1,a record1 nestedValue.value 3
Record2,2,b record2 nestedValue.value 3
Record3,3,c record3 nestedValue.value 3
`

let transform = [
  { key: 'name', label: 'THE,NAME', display: _.capitalize },
  { key: 'value', label: 'Value', display: _.identity },
  {
    key: 'nestedValue.value',
    label: 'Value RecordName Key TransformLength',
    display: (value, { key, record, transform }) =>
      `${value} ${record.name} ${key} ${transform.length}`,
  },
]

// These are skipped on purpose as they actual write CSVs
describe('full CSV test', () => {
  it('export to an actual csv file', async () => {
    let { writeStream, fileData } = mockFileStream()
    await csv({
      stream: writeStream,
      iterableData,
      transform,
    })
    expect(await fileData).toBe(expectedFileContents)
  })
})
