import _ from 'lodash/fp.js'
import terms_stats from './terms_stats.js'
import { expect, describe, it, vi } from 'vitest'

describe('terms_stats', () => {
  let defaultTree = {
    key: 'root',
    children: [
      {
        key: 'terms',
        type: 'terms_stats',
      },
      {
        key: 'results',
        type: 'results',
      },
    ],
  }

  let simpleRecords = ['record1', 'record2', 'record3']

  let getSimpleService = () =>
    vi.fn((tree) => {
      _.last(tree.children).context = {
        terms: simpleRecords,
        value: 1337,
      }
      return tree
    })

  let prepareSimpleStrategy = async ({
    strategyParams = {},
    service = getSimpleService(),
  } = {}) => {
    let tree = _.cloneDeep(defaultTree)
    let strategy = await terms_stats({
      service,
      tree,
      ...strategyParams,
    })
    return strategy
  }

  it('retrieves the total records (same as the given size)', async () => {
    let strategy = await prepareSimpleStrategy({
      strategyParams: { size: 1337 },
    })
    expect(strategy.getTotalRecords()).toBe(1337)
  })
  it('retrieves records', async () => {
    let service = getSimpleService()
    let strategy = await prepareSimpleStrategy({
      service,
      strategyParams: {
        size: 0,
        value_field: 'LineItem.TotalPrice',
      },
    })
    let arr = []
    for await (const i of strategy) arr.push(i)
    expect(arr).toEqual(simpleRecords)
    expect(service).toMatchSnapshot()
  })
  it('doesnt throw error when service returns unexpected result', async () => {
    let strategy = await prepareSimpleStrategy({ service: vi.fn(_.identity) })
    let arr = []
    for await (const i of strategy) arr.push(i)
    expect(arr).toEqual([])
  })
})
