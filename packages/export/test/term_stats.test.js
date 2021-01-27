import _ from 'lodash/fp'
import results from '../src/results'
import terms_stats from '../src/terms_stats'

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
    jest.fn(tree => {
      _.last(tree.children).context = {
        terms: simpleRecords,
        value: 1337,
      }
      return tree
    })

  let prepareSimpleStrategy = (strategyParams = {}) => {
    let service = getSimpleService()
    let tree = _.cloneDeep(defaultTree)
    let strategy = terms_stats({
      service,
      tree,
      ...strategyParams,
    })
    return strategy
  }

  it('retrieves the total records (same as the given size)', async () => {
    let strategy = prepareSimpleStrategy({ size: 1337 })
    expect(await strategy.getTotalRecords()).toBe(1337)
  })
  it('shows wether or not there are more obtainable records (only true if getNext has never been called)', async () => {
    let strategy = prepareSimpleStrategy()
    expect(await strategy.hasNext()).toBe(true)
    await strategy.getNext()
    expect(await strategy.hasNext()).toBe(false)
  })
  it('retrieves records with getNext', async () => {
    let strategy = prepareSimpleStrategy()
    expect(await strategy.getNext()).toEqual(simpleRecords)
  })
})
