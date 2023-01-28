import { jest } from '@jest/globals'
import provider from '../src/index.js'

const requestOptions = {
  headers: {
    email: 'my@email.com',
    name: 'user1',
  },
  requestTimeout: 1000,
}

const query_string = {
  default_field: 'FieldGroup.POLineItem',
  default_operator: 'AND',
  query: 'something',
}
const initialNode = { config: {}, _meta: { requests: [] } }
const initialSchema = { elasticsearch: {} }

describe('Core Provider', () => {
  it('groupCombinator should return a query joining filters by group.join', () => {
    expect(
      provider().groupCombinator({ join: 'or' }, ['Anything works'])
    ).toEqual({
      bool: {
        should: ['Anything works'],
        minimum_should_match: 1,
      },
    })
    expect(provider().groupCombinator({}, ['Anything works'])).toEqual({
      bool: {
        must: ['Anything works'],
      },
    })
  })
  it('runSearch should wrap queries in constant_score if sort._score is not present', () => {
    const client = {
      child: jest.fn().mockReturnValue({
        search: jest.fn().mockReturnValue(Promise.resolve({})),
      }),
    }

    provider({
      getClient: () => client,
    }).runSearch({}, initialNode, initialSchema, { query_string }, {})

    let firstSearchCall =
      client.child.mock.results[0].value.search.mock.calls[0]

    expect(firstSearchCall[0].body.query.constant_score.filter).toEqual({
      query_string,
    })
  })
  it('runSearch should not wrap queries in constant_score if no query is given', () => {
    const client = {
      child: jest.fn().mockReturnValue({
        search: jest.fn().mockReturnValue(Promise.resolve({})),
      }),
    }

    provider({
      getClient: () => client,
    }).runSearch({}, initialNode, initialSchema, null, {})

    let firstSearchCall =
      client.child.mock.results[0].value.search.mock.calls[0]

    expect(firstSearchCall[0].body).toEqual({ query: null })
  })
  it('runSearch should not wrap queries in constant_score if sort._score is present', () => {
    const client = {
      child: jest.fn().mockReturnValue({
        search: jest.fn().mockReturnValue(Promise.resolve({})),
      }),
    }

    provider({
      getClient: () => client,
    }).runSearch(
      {},
      initialNode,
      initialSchema,
      { query_string },
      { sort: { _score: 'desc' } }
    )

    let firstSearchCall =
      client.child.mock.results[0].value.search.mock.calls[0]

    expect(firstSearchCall[0].body.query).toEqual({
      query_string,
    })
  })
  it('should pass any request options to the child client upon initialization', () => {
    const client = {
      child: jest.fn().mockReturnValue({
        search: jest.fn().mockReturnValue(Promise.resolve({})),
      }),
    }

    provider({
      getClient: () => client,
    }).runSearch(
      { requestOptions },
      initialNode,
      initialSchema,
      { query_string },
      {}
    )

    expect(client.child.mock.calls[0][0]).toEqual({
      headers: requestOptions.headers,
      requestTimeout: requestOptions.requestTimeout,
    })
  })
})
