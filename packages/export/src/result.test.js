import _ from 'lodash/fp'
import results from '../src/results'
import { isAsyncIterable } from '../src/utils'

describe('results', () => {
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

  let simpleRecords = [{ name: 'record1' }, { name: 'record2' }, { name: 'record3' }]

  let getSimpleService = wrap =>
    jest.fn(tree => {
      let response = {
        totalRecords: 1337,
        results: simpleRecords.map(_source => ({ _source })),
      }
      _.last(tree.children).context = wrap ? { response } : response
      return tree
    })

  let prepareSimpleStrategy = service => (strategyParams = {}) => {
    let tree = _.cloneDeep(defaultTree)
    let include = ['a', 'b', 'c']
    let strategy = results({
      service,
      tree,
      pageSize: 3,
      page: 1,
      totalPages: 1,
      include,
      sortField: 'a',
      sortDir: 'desc',
      ...strategyParams,
    })
    return strategy
  }
  let resultsTests = prepareSimpleStrategy => {
    it('is an async iterable', async () => {
      let strategy = prepareSimpleStrategy({ totalPages: 1 })
      expect(isAsyncIterable(strategy)).toBe(true)
    })
    it('retrieves the total records', async () => {
      let strategy = prepareSimpleStrategy({ totalPages: 1 })
      expect(await strategy.getTotalRecords()).toBe(3)
      strategy = prepareSimpleStrategy({ totalPages: Infinity })
      expect(await strategy.getTotalRecords()).toBe(1337)
    })
    it('shows if there are more obtainable records', async () => {
      let strategy = prepareSimpleStrategy({ page: 1 })
      expect(await strategy.hasNext()).toBe(true)
      strategy = prepareSimpleStrategy({ page: 2 })
      expect(await strategy.hasNext()).toBe(false)
    })
    it('retrieves records consistently with getNext', async () => {
      let strategy = prepareSimpleStrategy({ page: 1 })
      expect(await strategy.getNext()).toEqual(simpleRecords)
    })
  }
  describe(' with contexts wrapped in `response`', () => {
    resultsTests(prepareSimpleStrategy(getSimpleService(false)))
  })
  describe(' with contexts not wrapped in `response`', () => {
    resultsTests(prepareSimpleStrategy(getSimpleService(true)))
  })
})
