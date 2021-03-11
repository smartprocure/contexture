import _ from 'lodash/fp'
import results from './results'

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

  let simpleRecords = [
    { name: 'record1' },
    { name: 'record2' },
    { name: 'record3' },
  ]

  let getSimpleService = wrap =>
    jest.fn(tree => {
      let response = {
        totalRecords: 3,
        results: simpleRecords.map(_source => ({ _source })),
      }
      _.last(tree.children).context = wrap ? { response } : response
      return tree
    })

  let prepareSimpleStrategy = service => async (strategyParams = {}) => {
    let tree = _.cloneDeep(defaultTree)
    let include = ['a', 'b', 'c']
    let strategy = await results({
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
      let strategy = await prepareSimpleStrategy({ totalPages: 1 })
      expect(await strategy.getTotalRecords()).toBe(3)
    })
    it('retrieves records consistently with getNext', async () => {
      let strategy = await prepareSimpleStrategy({ page: 1 })
      let arr = []
      for await (const i of strategy) arr.push(i)
      expect(arr).toEqual(simpleRecords)
    })
  }
  describe(' with contexts wrapped in `response`', () => {
    resultsTests(prepareSimpleStrategy(getSimpleService(false)))
  })
  describe(' with contexts not wrapped in `response`', () => {
    resultsTests(prepareSimpleStrategy(getSimpleService(true)))
  })
})
