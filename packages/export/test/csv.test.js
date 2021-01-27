import _ from 'lodash/fp'
import { createWriteStream } from 'fs'
import results from '../src/results'
import { isAsyncIterable } from '../src/utils'
// import terms_stats from '../src/modern/terms_stats'
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

// These are skipped on purpose as they actual write CSVs
describe.skip('full CSV test', () => {
  it('export to an actual csv file', async () => {
    await writeToStream(
      createWriteStream('./test/actualFile.csv'),
      results({
        service: mockResultsService(),
        tree: _.cloneDeep(testTree),
      }),
      await schemaToCSVTransforms(testSchema)
    )
  })
  it('should work with logging', async () => {
    let strategy = results({
      service: mockResultsService(),
      tree: _.cloneDeep(testTree),
    })
    let total = await strategy.getTotalRecords()
    await writeToStream(
      createWriteStream('./test/actualFile.csv'),
      strategy,
      await schemaToCSVTransformsWithLogging(testSchema, total)
    )
  })
})
