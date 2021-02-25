import _ from 'lodash/fp'
import { PassThrough } from 'stream'
import results from './results'
import * as csv from './csv'

let testTree = {
  key: 'root',
  children: [
    { key: 'filter', type: 'facet', field: 'a', values: ['a'] },
    { key: 'results', type: 'results' },
  ],
}
let testSchema = { name: { display: _.startCase, label: 'THE,NAME' } }

let mockResultsService = () =>
  jest.fn(tree => {
    _.last(tree.children).context = {
      totalRecords: 3,
      results: [
        { name: 'record1', value: 1 },
        { name: 'record2', value: 2 },
        { name: 'record3', value: 3 },
      ],
    }
    return tree
  })
let expectedFileContents = `\
"THE,NAME",Value
Record 1,1
Record 2,2
Record 3,3
`

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


let transformAndHeaders = [
  { record1: {label: 'Record 1'} },
  'record2',
  { record3: { display: x => `${x} transformed` } }
];


// These are skipped on purpose as they actual write CSVs
xdescribe('full CSV test', () => {
  it('export to an actual csv file', async () => {
    let { writeStream, fileData } = mockFileStream()
    let strategy = results({
      service: mockResultsService(),
      tree: _.cloneDeep(testTree),
    })

    await writeCSV({
      writeStream,
      strategy,
      transformAndHeaders
    })
    expect(await fileData).toBe(expectedFileContents)
  })
})

describe('headerKeys', () => {
  it('should return the keys', () => {
    expect(csv.headerKeys(transformAndHeaders)).toEqual(['record1', 'record2', 'record3'])
  })
})

describe('headerLabels', () => {
  it('should return the keys', () => {
    expect(csv.headerLabels(transformAndHeaders)).toEqual(['Record 1', 'record2', 'record3'])
  })
})
