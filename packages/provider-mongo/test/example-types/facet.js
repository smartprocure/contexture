let { expect } = require('chai')
let _ = require('lodash/fp')
let facet = require('../../src/example-types/facet')

describe('facet', () => {
  describe('facet.hasValue', () => {
    it('Should allow contexts with values', () => {
      expect(
        facet.hasValue({
          values: [1, 2],
        })
      ).to.equal(2)
    })
    it('Should not allow contexts with values', () => {
      expect(
        facet.hasValue({
          values: [],
        })
      ).to.equal(0)
    })
  })
  describe('facet.result', () => {
    let queries = []
    let search = async query => {
      queries.push(query)
      return [1, 2, 3].map(i => ({ _id: `${i}`, count: i }))
    }
    it('should call the search function and wait for it', async () => {
      queries = []
      let context = {
        field: 'myField',
      }
      let result = await facet.result(context, search)
      expect(result.options.length).to.equal(3)
      expect(_.every(x => _.isNumber(x.count), result.options)).to.equal(true)
    })
    it('should default the limit query to 10 if size is not provided', async () => {
      queries = []
      let context = {
        field: 'myField',
      }
      await facet.result(context, search)
      expect(queries[0][1].$limit).to.equal(10)
    })
    it('should allow unlimited queries', async () => {
      queries = []
      let context = {
        field: 'myField',
        size: 0,
      }
      await facet.result(context, search)
      expect(queries[0][1]).to.equal(undefined)
    })
  })
})
