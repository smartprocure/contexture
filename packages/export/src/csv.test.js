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



// These are skipped on purpose as they actual write CSVs
xdescribe('full CSV test', () => {
  it('export to an actual csv file', async () => {
    let { writeStream, fileData } = mockFileStream()
    let strategy = results({
      service: mockResultsService(),
      tree: _.cloneDeep(testTree),
    })

    await writeCSV({
      writeStream, // target stream
      strategy, // iterator for each page of an array of objects
      headers: [{ field1: 'Label' }, 'fieldA', { field2: 'Label 1' }], // ordered list of fields and/or field:label pairs
      transformRecord, // function to transform each record 
      onWrite // function to intercept writing a page of records
    })
    expect(await fileData).toBe(expectedFileContents)
  })

})


describe('headerKeys', () => {
  it('should return the keys', () => {
    let headers = [{ field1: 'Label' }, 'fieldA', { field2: 'Label 1' }]
    expect(csv.headerKeys(headers)).toEqual(['field1', 'fieldA', 'field2'])
  })
})

describe('headerLabels', () => {
  it('should return the keys', () => {
    let headers = [{ field1: 'Label' }, 'fieldA', { field2: 'Label 1' }]
    expect(csv.headerLabels(headers)).toEqual(['Label', 'fieldA', 'Label 1'])
  })
})
