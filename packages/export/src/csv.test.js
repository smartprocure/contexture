import _ from 'lodash/fp'
import { PassThrough } from 'stream'
import results from '../src/results'
import { writeToStream } from '../src/fast-csv-wrapper'
import {
  schemaToCSVTransforms,
  schemaToCSVTransformsWithLogging,
} from '../src/schemaToCSVTransforms'

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
describe('full CSV test', () => {
  it('export to an actual csv file', async () => {
    let { writeStream, fileData } = mockFileStream()

    await writeToStream(
      writeStream,
      results({
        service: mockResultsService(),
        tree: _.cloneDeep(testTree),
      }),
      await schemaToCSVTransforms(testSchema)
    )
    expect(await fileData).toBe(expectedFileContents)
  })

  it('should work with logging', async () => {
    let { writeStream, fileData } = mockFileStream()

    let strategy = results({
      service: mockResultsService(),
      tree: _.cloneDeep(testTree),
    })
    let total = await strategy.getTotalRecords()
    await writeToStream(
      writeStream,
      strategy,
      await schemaToCSVTransformsWithLogging(testSchema, total)
    )
    expect(await fileData).toBe(expectedFileContents)
  })
})
