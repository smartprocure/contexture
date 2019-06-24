import _ from 'lodash/fp'
import * as dataStrategies from '../src/dataStrategies'

describe('dataStrategies', () => {
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

  describe('results', () => {
    let simpleRecords = ['record1', 'record2', 'record3']

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
      let strategy = dataStrategies.results({
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
      it('retrieves the total records', async () => {
        let strategy = prepareSimpleStrategy({ totalPages: 1 })
        expect(await strategy.getTotalRecords()).toBe(3)
        strategy = prepareSimpleStrategy({ totalPages: Infinity })
        expect(await strategy.getTotalRecords()).toBe(1337)
      })
      it('shows wether or not there are more obtainable records', async () => {
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

  describe('terms_stats', () => {
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
      let strategy = dataStrategies.terms_stats({
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
})
