import { getResults, getTotal } from './fieldValuesGroupStats.js'
import { expect, describe, it } from 'vitest'

const cardinalityResult = {
  context: { cardinality: 10 },
}

const fieldValuesGroupStatsResult = {
  context: {
    results: [
      {
        sum: 10,
        count: 20,
        key: 'John',
        topHits: {
          hits: [
            {
              _source: {
                address: '201 John Wick Rd.',
              },
            },
          ],
        },
      },
      {
        sum: 20,
        count: 30,
        key: 'Wick',
        topHits: {
          hits: [
            {
              _source: {
                address: '32th Lincoln St.',
              },
            },
          ],
        },
      },
    ],
  },
}

describe('getTotal()', () => {
  it('should return correct cardinality count', async () => {
    const result = await getTotal(
      (node) => {
        expect(node).toEqual({
          type: 'stats',
          statsField: 'name',
          stats: { cardinality: true },
        })
        return cardinalityResult
      },
      { groupField: 'name' }
    )
    expect(result).toEqual(10)
  })
})

describe('getResults()', () => {
  it('should return correct results', async () => {
    const runSearch = (node) => {
      if (node.type === 'stats') {
        return cardinalityResult
      }

      expect(node).toEqual({
        type: 'fieldValuesGroupStats',
        groupField: 'name',
        statsField: 'age',
        size: 10,
        stats: { sum: true },
      })

      return fieldValuesGroupStatsResult
    }

    const result = await getResults(runSearch, {
      groupField: 'name',
      statsField: 'age',
    })

    expect(result).toEqual([
      { sum: 10, count: 20, name: 'John' },
      { sum: 20, count: 30, name: 'Wick' },
    ])
  })

  it('should return correct results with included fields', async () => {
    const runSearch = (node) => {
      if (node.type === 'stats') {
        return cardinalityResult
      }

      expect(node).toEqual({
        type: 'fieldValuesGroupStats',
        groupField: 'name',
        statsField: 'age',
        size: 10,
        stats: { sum: true, topHits: { size: 1, _source: ['address'] } },
      })

      return fieldValuesGroupStatsResult
    }

    const result = await getResults(runSearch, {
      groupField: 'name',
      statsField: 'age',
      includeFields: ['address'],
    })

    expect(result).toEqual([
      { sum: 10, count: 20, name: 'John', address: '201 John Wick Rd.' },
      { sum: 20, count: 30, name: 'Wick', address: '32th Lincoln St.' },
    ])
  })
})
