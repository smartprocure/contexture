let { expect } = require('chai')
let statistical = require('../../src/example-types/statistical')

describe('statistical', () => {
  describe('statistical.result', () => {
    it('result should output the expected query', async () => {
      let field = 'price'
      expect(
        await statistical.result(
          {
            key: 'test',
            type: 'statistical',
            field,
          },
          x => x
        )
      ).eql({
        $group: {
          _id: {},
          count: { $sum: 1 },
          max: {
            $max: `$${field}`,
          },
          min: {
            $min: `$${field}`,
          },
          avg: {
            $avg: `$${field}`,
          },
          sum: {
            $sum: `$${field}`,
          },
        },
      })
    })
    it('result should handle no results', async () => {
      let field = 'price'
      expect(
        await statistical.result(
          {
            key: 'test',
            type: 'statistical',
            field,
          },
          x => []
        )
      ).eql({
        count: 0,
        avg: 0,
        max: 0,
        min: 0,
        sum: 0,
      })
    })
  })
})
