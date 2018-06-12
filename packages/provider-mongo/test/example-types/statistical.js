let { expect } = require('chai')
let statistical = require('../../src/example-types/statistical')

describe('statistical', () => {
  describe('result should output the expected auery', () => {
    let field = 'price'
    expect(
      statistical.result(
        {
          key: 'test',
          type: 'statistical',
          field,
        },
        x => x
      )
    ).eql([
      {
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
      },
    ])
  })
})
