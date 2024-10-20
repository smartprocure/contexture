import _ from 'lodash/fp.js'
import {
  mongoConnect,
  mongoDisconnect,
  usingCollections,
} from '../../test/mongoTestUtil.js'
import termsStats from './termsStats.js'
import { expect, describe, it, beforeAll, afterAll } from 'vitest'

beforeAll(mongoConnect)

afterAll(mongoDisconnect)

describe('termsStats', () => {
  describe('termsStats.result', () => {
    it('result should output the expected query and results', async () => {
      await usingCollections(async (data) => {
        await data.insertMany(
          _.times(
            (i) => ({ name: `#${i % 5}`, metrics: { usersCount: i * 100 } }),
            50
          )
        )

        let query = null
        let search = _.flow(
          _.tap((x) => (query = x)),
          (aggs) => data.aggregate(aggs).toArray()
        )

        let result = await termsStats.result(
          {
            key: 'test',
            type: 'termsStats',
            key_field: 'name',
            value_field: 'metrics.usersCount',
          },
          search
        )
        expect(query).toEqual([
          {
            $group: {
              _id: `$name`,
              count: { $sum: 1 },
              max: { $max: `$metrics.usersCount` },
              min: { $min: `$metrics.usersCount` },
              avg: { $avg: `$metrics.usersCount` },
              sum: { $sum: `$metrics.usersCount` },
            },
          },
        ])
        const sortedTerms = _.sortBy('key', result.terms)
        expect(sortedTerms).toEqual([
          { key: '#0', count: 10, max: 4500, min: 0, avg: 2250, sum: 22500 },
          { key: '#1', count: 10, max: 4600, min: 100, avg: 2350, sum: 23500 },
          { key: '#2', count: 10, max: 4700, min: 200, avg: 2450, sum: 24500 },
          { key: '#3', count: 10, max: 4800, min: 300, avg: 2550, sum: 25500 },
          { key: '#4', count: 10, max: 4900, min: 400, avg: 2650, sum: 26500 },
        ])
      })
    })
  })
})
