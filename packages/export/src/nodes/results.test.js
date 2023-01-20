import { jest } from '@jest/globals'
import _ from 'lodash/fp.js'
import results from './results.js'

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

  let resultsTests = ({ wrap }) => {
    let getSimpleService = () =>
      jest.fn(tree => {
        let response = {
          totalRecords: 3,
          results: simpleRecords.map(_source => ({ _source })),
        }
        _.last(tree.children).context = wrap ? { response } : response
        return tree
      })

    let prepareSimpleStrategy =
      service =>
      async (strategyParams = {}) => {
        let tree = _.cloneDeep(defaultTree)
        let include = ['a', 'b', 'c']
        let strategy = await results({
          service,
          tree,
          pageSize: 3,
          page: 1,
          totalPages: 1,
          include,
          highlight: false,
          sortField: 'a',
          sortDir: 'desc',
          ...strategyParams,
        })
        return strategy
      }
    it('retrieves the total records', async () => {
      let strategy = await prepareSimpleStrategy(getSimpleService())({
        totalPages: 1,
      })
      expect(await strategy.getTotalRecords()).toBe(3)
    })
    it('retrieves records', async () => {
      let service = getSimpleService()
      let strategy = await prepareSimpleStrategy(service)({ page: 1 })
      let arr = []
      for await (const i of strategy) arr.push(i)
      expect(arr).toEqual(simpleRecords)
      expect(service).toMatchSnapshot()
    })
  }
  describe(' with contexts wrapped in `response`', () => {
    resultsTests({ wrap: false })
  })
  describe(' with contexts not wrapped in `response`', () => {
    resultsTests({ wrap: true })
  })
})
