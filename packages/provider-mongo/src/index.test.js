import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import _ from 'lodash/fp.js'
import Contexture from 'contexture'
import { ObjectId } from 'mongodb'
import {
  mongoConnect,
  mongoDisconnect,
  usingCollections,
} from '../jest/mongoTestUtil.js'
import provider from './index.js'
import types from './types.js'

beforeAll(mongoConnect)

afterAll(mongoDisconnect)

const records = _.map(
  ({ _id, nextCode, ...rest }) => ({
    _id: new ObjectId(_id),
    nextCode: new ObjectId(nextCode),
    ...rest,
  }),
  [
    {
      _id: '65591127bfcc415b60c46975',
      code: '001122',
      nextCode: '65591127bfcc415b60c46976',
    },
    {
      _id: '65591127bfcc415b60c46976',
      code: '112233',
      nextCode: '65591127bfcc415b60c46977',
    },
    {
      _id: '65591127bfcc415b60c46977',
      code: '223344',
      nextCode: '65591127bfcc415b60c46975',
    },
  ]
)

let getSearch = (schema) =>
  Contexture({
    schemas: {
      [schema]: {
        mongo: {
          collection: schema,
        },
      },
    },
    providers: {
      mongo: provider({
        getClient: () => global.__mongoClient.db(),
        types: types(),
      }),
    },
  })

describe('Grouping text and mongoId', () => {
  it('should work', async () => {
    await usingCollections(async (data) => {
      let schema = data.collectionName
      let search = getSearch(schema)
      let tree = {
        type: 'group',
        schema,
        join: 'and',
        items: [
          {
            key: 'text',
            type: 'text',
            field: 'code',
            operator: 'containsWord',
            value: '22',
          },
          {
            key: 'results',
            type: 'results',
          },
        ],
      }
      await data.insertMany(records)
      let result = await search(tree)
      let response = _.last(result.items).context.response
      expect(response.totalRecords).toBe(3)
      expect(JSON.stringify(response.results)).toEqual(JSON.stringify(records))
    })
  })

  it('should work with populate', async () => {
    await usingCollections(async (data) => {
      let schema = data.collectionName
      let search = getSearch(schema)
      let tree = {
        type: 'group',
        schema,
        join: 'and',
        items: [
          {
            key: 'text',
            type: 'text',
            field: 'code',
            operator: 'containsWord',
            value: '22',
          },
          {
            key: 'results',
            type: 'results',
            config: {
              populate: {
                child: {
                  schema,
                  foreignField: '_id',
                  localField: 'nextCode',
                },
              },
            },
          },
        ],
      }

      await data.insertMany(records)
      let result = await search(tree)
      let response = _.last(result.items).context.response

      let actual = response.totalRecords
      let expected = 3
      expect(actual).toBe(expected)

      actual = JSON.stringify(response.results)
      expected = JSON.stringify(
        _.map(
          (record) => ({
            ...record,
            child: [
              _.find(
                (x) => _.toString(x._id) === _.toString(record.nextCode),
                records
              ),
            ],
          }),
          records
        )
      )
      expect(actual).toBe(expected)

      actual = _.toString(_.get('results.0.nextCode', response))
      expected = _.toString(_.get('0.nextCode', records))
      expect(actual).toBe(expected)
    })
  })
})
