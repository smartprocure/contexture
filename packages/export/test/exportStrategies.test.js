import _ from 'lodash/fp'
import * as exportStrategies from '../src/exportStrategies'

describe('exportStrategies', () => {
  let getSimpleStrategy = getNext => {
    let page = 1
    let totalPages = 3
    return {
      getTotalRecords: () => 4,
      hasNext: () => page < totalPages,
      getNext() {
        let result = [page]
        page++
        if (getNext) return getNext()
        return result
      },
    }
  }

  describe('paged', () => {
    it('should work', async () => {
      let strategy = getSimpleStrategy()
      let onChange = jest.fn()
      await exportStrategies.paged({ strategy, onChange })
      expect(onChange.mock.calls).toEqual([[[1]], [[2]]])
    })
  })

  describe('bulk', async () => {
    it('should work', async () => {
      let strategy = getSimpleStrategy()
      let result = await exportStrategies.bulk({ strategy })
      expect(result).toEqual([1, 2])
    })
  })

  describe('stream', () => {
    it('should work', async () => {
      let strategy = getSimpleStrategy()
      let stream = {
        write: jest.fn(),
        end: jest.fn(),
      }
      await exportStrategies.stream({ strategy, stream })
      expect(stream.write.mock.calls).toEqual([[[1]], [[2]]])
      expect(stream.end).toHaveBeenCalled()
    })
  })

  describe('CSVStream', () => {
    it('should work without include', async () => {
      let getNext = () => [
        {
          firstProperty: 'first',
          secondProperty: 'second',
        },
      ]
      let strategy = getSimpleStrategy(getNext)
      let stream = {
        write: jest.fn(),
        end: jest.fn(),
      }
      let onWrite = jest.fn()
      let logger = jest.fn()
      let formatRules = {
        firstProperty: {
          label: 'First Prop',
          display: _.toUpper,
        },
        secondProperty: {
          display: _.toUpper,
        },
      }
      await exportStrategies.CSVStream({
        strategy,
        stream,
        onWrite,
        formatRules,
        logger,
      })
      expect(stream.write.mock.calls).toEqual([
        [
          `"First Prop","Second Property"
"FIRST","SECOND"
`,
        ],
        [
          `"FIRST","SECOND"
`,
        ],
      ])
      expect(onWrite.mock.calls).toEqual([
        [
          {
            chunk: [],
            totalRecords: 4,
          },
        ],
        [
          {
            chunk: [
              {
                'First Prop': 'FIRST',
                'Second Property': 'SECOND',
              },
            ],
            records: 1,
            totalRecords: 4,
          },
        ],
        [
          {
            chunk: [
              {
                'First Prop': 'FIRST',
                'Second Property': 'SECOND',
              },
            ],
            records: 2,
            totalRecords: 4,
          },
        ],
      ])
      // 1 per page because of our getNext function,
      // Contexture is responsible for making sure the query is consistent with
      // the database results.
      expect(logger.mock.calls).toEqual([
        ['CSVStream', '1 of 4'],
        ['CSVStream', '2 of 4'],
      ])
      expect(stream.end).toHaveBeenCalled()
    })
    it('should work with inlcude and empty value in column', async () => {
      let getNext = () => [
        {
          Title: undefined,
          AgencyName: 'Agency A'
        },
      ]
      // Simulate the results data strategy where the `include` is exposed
      let strategy = _.extend({include: ['Title', 'AgencyName']}, getSimpleStrategy(getNext))
      let stream = {
        write: jest.fn(),
        end: jest.fn(),
      }
      let onWrite = jest.fn()
      let logger = jest.fn()
      let formatRules = {}
      await exportStrategies.CSVStream({
        strategy,
        stream,
        onWrite,
        formatRules,
        logger,
      })
      expect(stream.write.mock.calls).toEqual([
        [
          `"Title","Agency Name"
"","Agency A"
`,
        ],
        [
          `"","Agency A"
`,
        ],
      ])
      expect(onWrite.mock.calls).toEqual([
        [
          {
            chunk: [],
            totalRecords: 4,
          },
        ],
        [
          {
            chunk: [
              {
                'Title': undefined,
                'Agency Name': 'Agency A',
              },
            ],
            records: 1,
            totalRecords: 4,
          },
        ],
        [
          {
            chunk: [
              {
                'Title': undefined,
                'Agency Name': 'Agency A',
              },
            ],
            records: 2,
            totalRecords: 4,
          },
        ],
      ])
      // 1 per page because of our getNext function,
      // Contexture is responsible for making sure the query is consistent with
      // the database results.
      expect(logger.mock.calls).toEqual([
        ['CSVStream', '1 of 4'],
        ['CSVStream', '2 of 4'],
      ])
      expect(stream.end).toHaveBeenCalled()
    })
  })
  describe('utils', () => {
    let {
      convertData,
      convertColumns,
      rowsToCSV,
      extractKeysFromFirstRow,
    } = exportStrategies
    let columnKeys = ['name', 'age']
    let chunk = [
      { name: 'Bob "Bobby" Brown', age: 36 },
      { name: 'Joe Blow', age: 40 },
    ]
    it('extractKeysFromFirstRow', () => {
      expect(extractKeysFromFirstRow(chunk)).toEqual(['name', 'age'])
    })
    it('convertData', () => {
      expect(convertData(chunk, columnKeys)).toEqual([
        ['Bob "Bobby" Brown', 36],
        ['Joe Blow', 40],
      ])
    })
    it('convertColumns', () => {
      expect(convertColumns(columnKeys)).toEqual(['Name', 'Age'])
    })
    it('rowsToCSV', () => {
      let rows = [['Name', 'Age'], ['Bob "Bobby" Brown', 36], ['Joe Blow', 40]]
      expect(rowsToCSV(rows)).toEqual(`"Name","Age"
"Bob ""Bobby"" Brown","36"
"Joe Blow","40"
`)
    })
  })
})
