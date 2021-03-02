import _ from 'lodash/fp'
import { PassThrough } from 'stream'
import results from './results'
import * as csv from './csv'

let mockFileStream = () => {
  let writeStream = new PassThrough()
  let fileData = new Promise((res,rej) => {
    let data = []
    writeStream.on('data', d => data.push(d.toString()))
    writeStream.on('end', () => res(_.join('', data)))
    writeStream.on('error', rej)
  })
  return { writeStream, fileData }
}

let iterableData = [
  { name: 'record1', value: 1 },
  { name: 'record2', value: 2 },
  { name: 'record3', value: 3 },
]

let expectedFileContents = `\
"THE,NAME",Value
Record1,1
Record2,2
Record3,3
`

let transform = [
  {key: 'name', label: 'THE,NAME', display: _.capitalize},
  {key: 'value', label: 'Value', display: _.identity},
];


// These are skipped on purpose as they actual write CSVs
describe('full CSV test', () => {
  it('export to an actual csv file', async () => {
    let { writeStream, fileData } = mockFileStream()
    await csv.writeCSV({
      stream: writeStream,
      iterableData,
      transform,
    })
    expect(await fileData).toBe(expectedFileContents)
  })
})

describe('transformLabels', () => {
  it('should return the lebels', () => {
    expect(csv.transformLabels(transform)).toEqual(['THE,NAME', 'Value'])
  })
})
