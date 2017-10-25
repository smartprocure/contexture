let query = require('../../src/example-types/query')
let { expect } = require('chai')

describe('query', () => {
  it('should filter properly', () => {
    expect(
      query.filter({
        key: 'test',
        type: 'query',
        field: '_all',
        data: {
          query: 'cable',
        },
      })
    ).to.deep.equal({
      query_string: {
        query: 'cable',
        default_operator: 'AND',
        default_field: '_all',
      },
    })
    expect(
      query.filter({
        key: 'test',
        type: 'query',
        field: '_all',
        data: {
          query: 'cable',
          exact: true,
        },
      })
    ).to.deep.equal({
      query_string: {
        query: 'cable',
        default_operator: 'AND',
        default_field: '_all.exact',
        analyzer: 'exact',
      },
    })
  })
})
