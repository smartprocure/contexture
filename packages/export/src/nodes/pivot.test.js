import { jest } from '@jest/globals'
import _ from 'lodash/fp.js'
import F from 'futil'
import { getKey } from 'contexture-client/exampleTypes/pivot.js'
import pivot, { getGroupingSize } from './pivot.js'

let RowTree = F.tree(_.get('rows'), (key) => ({ key }))

describe('pivot', () => {
  let pivotNode = {
    key: 'report',
    type: 'pivot',
    columns: [
      {
        field: 'PO.IssuedDate',
        type: 'dateInterval',
        interval: 'year',
      },
    ],
    rows: [
      {
        field: 'Organization.State',
        type: 'fieldValues',
        size: 10,
      },
      {
        field: 'Organization.City',
        type: 'fieldValues',
      },
    ],
    values: [
      {
        field: 'LineItem.TotalPrice',
        type: 'sum',
      },
    ],
  }

  let defaultTree = {
    key: 'root',
    children: [
      pivotNode,
      {
        key: 'results',
        type: 'results',
      },
    ],
  }

  let pivotResult = {
    'sum-LineItem.TotalPrice': 397196681577.4607,
    columns: [
      {
        keyAsString: '2021-01-01T00:00:00.000Z',
        key: 1609459200000,
        count: 9841186,
        'sum-LineItem.TotalPrice': 129783208652.72542,
      },
      {
        keyAsString: '2022-01-01T00:00:00.000Z',
        key: 1640995200000,
        count: 21751429,
        'sum-LineItem.TotalPrice': 215216937070.0412,
      },
      {
        keyAsString: '2023-01-01T00:00:00.000Z',
        key: 1672531200000,
        count: 7810898,
        'sum-LineItem.TotalPrice': 52196535854.69407,
      },
    ],
    rows: [
      {
        key: 'Texas',
        count: 30732145,
        metric: 314939690225.14624,
        'sum-LineItem.TotalPrice': 314939690225.14624,
        columns: [
          {
            keyAsString: '2022-01-01T00:00:00.000Z',
            key: 1640995200000,
            count: 17255993,
            'sum-LineItem.TotalPrice': 170772861458.61346,
          },
          {
            keyAsString: '2023-01-01T00:00:00.000Z',
            key: 1672531200000,
            count: 6158859,
            'sum-LineItem.TotalPrice': 35109618846.44213,
          },
        ],
        rows: [
          {
            key: 'Houston',
            'sum-LineItem.TotalPrice': 314939690225.14624,
            columns: [
              {
                keyAsString: '2022-01-01T00:00:00.000Z',
                key: 1640995200000,
                count: 17255993,
                'sum-LineItem.TotalPrice': 170772861458.61346,
              },
              {
                keyAsString: '2023-01-01T00:00:00.000Z',
                key: 1672531200000,
                count: 6158859,
                'sum-LineItem.TotalPrice': 35109618846.44213,
              },
            ],
          },
        ],
      },
      {
        key: 'Florida',
        count: 8671368,
        metric: 82256991352.31442,
        'sum-LineItem.TotalPrice': 82256991352.31442,
        columns: [
          {
            keyAsString: '2021-01-01T00:00:00.000Z',
            key: 1609459200000,
            count: 2523893,
            'sum-LineItem.TotalPrice': 20725998732.634754,
          },
          {
            keyAsString: '2022-01-01T00:00:00.000Z',
            key: 1640995200000,
            count: 4495436,
            'sum-LineItem.TotalPrice': 44444075611.42773,
          },
          {
            keyAsString: '2023-01-01T00:00:00.000Z',
            key: 1672531200000,
            count: 1652039,
            'sum-LineItem.TotalPrice': 17086917008.251938,
          },
        ],
        rows: [
          {
            key: 'Miami',
            'sum-LineItem.TotalPrice': 82256991352.31442,
            columns: [
              {
                keyAsString: '2021-01-01T00:00:00.000Z',
                key: 1609459200000,
                count: 2523893,
                'sum-LineItem.TotalPrice': 20725998732.634754,
              },
              {
                keyAsString: '2022-01-01T00:00:00.000Z',
                key: 1640995200000,
                count: 4495436,
                'sum-LineItem.TotalPrice': 44444075611.42773,
              },
              {
                keyAsString: '2023-01-01T00:00:00.000Z',
                key: 1672531200000,
                count: 1652039,
                'sum-LineItem.TotalPrice': 17086917008.251938,
              },
            ],
          },
        ],
      },
    ],
    count: 39403513,
  }

  let getService = () =>
    jest.fn((tree) => {
      _.last(tree.children).context = { results: pivotResult }
      return tree
    })

  let prepareSimpleStrategy = async () =>
    pivot({
      service: getService(),
      tree: _.cloneDeep(defaultTree),
      ...pivotNode,
    })

  it('should retrieve estimated export credits', async () => {
    let strategy = await prepareSimpleStrategy()
    expect(await strategy.getTotalRecords()).toBe(20)
  })
  it('retrieves records', async () => {
    let service = getService()
    let strategy = await prepareSimpleStrategy()

    let expectedRecords = RowTree.toArrayBy(
      (record, index = 0, parents) => ({
        ...record,
        index,
        level: parents.length - 1,
        path: _.compact([..._.map(getKey, _.reverse(parents)), getKey(record)]),
        recordCount: _.size(record.columns) + 1,
        rows: undefined,
      }),
      pivotResult
    )
    expectedRecords.push({ ...expectedRecords.shift(), isTotalRow: true })

    let records = []
    for await (const r of strategy) records.push(r)

    let exportedRecordCount = _.sumBy(
      'recordCount',
      records
    )

    expect(exportedRecordCount).toEqual(18)
    expect(records).toEqual(expectedRecords)
    expect(service).toMatchSnapshot()
  })

  it('should get grouping size', () => {
    let groupingSizeResult = {
      rowsGroupCount: 9,
      rows: [
        {
          rowsGroupCount: 8,
        },
        {
          rowsGroupCount: 200, // should limit to size 10
        },
        {
          rows: [{}, {}, {}, {}],
        },
        {
          rows: [
            // should limit to size 10
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
          ],
        },
      ],
    }

    expect(getGroupingSize(pivotNode, 'rows', groupingSizeResult)).toEqual(42)
  })
})
