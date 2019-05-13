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
                firstProperty: 'FIRST',
                secondProperty: 'SECOND',
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
                firstProperty: 'FIRST',
                secondProperty: 'SECOND',
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
          AgencyName: 'Agency A',
        },
      ]
      // Simulate the results data strategy where the `include` is exposed
      let strategy = _.extend(
        { include: ['Title', 'AgencyName'] },
        getSimpleStrategy(getNext)
      )
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
                Title: '',
                AgencyName: 'Agency A',
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
                Title: '',
                AgencyName: 'Agency A',
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
      formatHeaders,
      formatValues,
      rowsToCSV,
      extractHeadersFromFirstRow,
    } = exportStrategies
    let columnKeys = ['name', 'age']
    let chunk = [
      { name: 'Bob "Bobby" Brown', age: 36 },
      { name: 'Joe Blow', age: 40 },
    ]
    it('extractHeadersFromFirstRow', () => {
      expect(extractHeadersFromFirstRow(chunk)).toEqual(['name', 'age'])
    })
    it('formatValues with no rules', () => {
      expect(formatValues({})(chunk)).toEqual([
        { age: 36, name: 'Bob "Bobby" Brown' },
        { age: 40, name: 'Joe Blow' },
      ])
    })
    it('formatValues with rules', () => {
      expect(
        formatValues({
          name: { display: _.toLower },
          age: { display: _.toString },
        })(chunk)
      ).toEqual([
        { age: '36', name: 'bob "bobby" brown' },
        { age: '40', name: 'joe blow' },
      ])
    })
    it('formatValues with no rules and empty props', () => {
      let columnKeys = [
        'AgencyName',
        'FullName',
        'Title',
        'AgencyType',
        'AddressState',
      ]
      let data = [
        {
          AgencyName: 'ABC',
          AgencyType: 'Private Schools',
          AddressState: 'IL',
        },
        {
          AgencyName: 'DEF',
          FullName: 'D P',
          Title: 'Auditor',
          AgencyType: 'State',
          AddressState: 'CA',
        },
        { AddressState: 'FL' },
      ]
      expect(formatValues({}, columnKeys)(data)).toEqual([
        {
          AgencyName: 'ABC',
          AgencyType: 'Private Schools',
          AddressState: 'IL',
          Title: '',
          FullName: '',
        },
        {
          AgencyName: 'DEF',
          AgencyType: 'State',
          AddressState: 'CA',
          Title: 'Auditor',
          FullName: 'D P',
        },
        {
          AgencyName: '',
          AgencyType: '',
          AddressState: 'FL',
          Title: '',
          FullName: '',
        },
      ])
    })
    it('formatValues with rules and empty props', () => {
      let columnKeys = [
        'AgencyName',
        'FullName',
        'Title',
        'AgencyType',
        'AddressState',
      ]
      let data = [
        {
          AgencyName: 'ABC',
          AgencyType: 'Private Schools',
          AddressState: 'IL',
        },
        {
          AgencyName: 'DEF',
          FullName: 'D P',
          Title: 'Auditor',
          AgencyType: 'State',
          AddressState: 'CA',
        },
        { AddressState: 'FL' },
      ]
      let rules = {
        AgencyType: {
          display: _.toUpper,
        },
        AddressState: {
          display: _.toLower,
        },
      }
      expect(formatValues(rules, columnKeys)(data)).toEqual([
        {
          AgencyName: 'ABC',
          AgencyType: 'PRIVATE SCHOOLS',
          AddressState: 'il',
          Title: '',
          FullName: '',
        },
        {
          AgencyName: 'DEF',
          AgencyType: 'STATE',
          AddressState: 'ca',
          Title: 'Auditor',
          FullName: 'D P',
        },
        {
          AgencyName: '',
          AgencyType: '',
          AddressState: 'fl',
          Title: '',
          FullName: '',
        },
      ])
    })
    it('formatHeaders with no rules', () => {
      expect(formatHeaders({})(columnKeys)).toEqual(['Name', 'Age'])
    })
    it('formatHeaders with rules', () => {
      expect(
        formatHeaders({
          name: { label: 'A' },
          age: { label: 'B' },
        })(columnKeys)
      ).toEqual(['A', 'B'])
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
