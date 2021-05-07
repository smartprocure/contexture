let sinon = require('sinon')
let provider = require('../src/index')
let { expect } = require('chai')

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

describe.only('Core Provider', () => {
  it('groupCombinator should return a query joining filters by group.join', () => {
    expect(
      provider().groupCombinator({ join: 'or' }, ['Anything works'])
    ).to.eql({
      bool: {
        should: ['Anything works'],
        minimum_should_match: 1,
      },
    })
    expect(provider().groupCombinator({}, ['Anything works'])).to.eql({
      bool: {
        must: ['Anything works'],
      },
    })
  })
  it('runSearch should wrap queries in constant_score if sort._score is not present', async () => {
    const client = {
      child: sinon
        .stub()
        .returns({ search: sinon.stub().returns(Promise.resolve({})) }),
    }

    const node = { config: {}, _meta: { requests: [] } }
    const schema = { elasticsearch: {} }

    provider({
      getClient: () => client,
    }).runSearch({}, node, schema, { query_string }, {})

    let firstSearchCall = client.child.firstCall.returnValue.search.firstCall

    expect(firstSearchCall.args[0].body.query.constant_score.filter).to.eql({
      query_string,
    })
  })
  it('runSearch should not wrap queries in constant_score if no query is given', () => {
    const client = {
      child: sinon
        .stub()
        .returns({ search: sinon.stub().returns(Promise.resolve({})) }),
    }

    const node = { config: {}, _meta: { requests: [] } }
    const schema = { elasticsearch: {} }

    provider({
      getClient: () => client,
    }).runSearch({}, node, schema, null, {})

    let firstSearchCall = client.child.firstCall.returnValue.search.firstCall

    expect(firstSearchCall.args[0].body).to.eql({ query: null })
  })
  it('runSearch should not wrap queries in constant_score if sort._score is present', () => {
    const client = {
      child: sinon
        .stub()
        .returns({ search: sinon.stub().returns(Promise.resolve({})) }),
    }

    const node = { config: {}, _meta: { requests: [] } }
    const schema = { elasticsearch: {} }

    provider({
      getClient: () => client,
    }).runSearch(
      {},
      node,
      schema,
      { query_string },
      { sort: { _score: 'desc' } }
    )

    let firstSearchCall = client.child.firstCall.returnValue.search.firstCall

    expect(firstSearchCall.args[0].body.query).to.eql({
      query_string,
    })
  })
  it('should pass any request options to the child client upon initialization', async () => {
    const client = {
      child: sinon
        .stub()
        .returns({ search: sinon.stub().returns(Promise.resolve({})) }),
    }

    const node = { config: {}, _meta: { requests: [] } }
    const schema = { elasticsearch: {} }

    provider({
      getClient: () => client,
    }).runSearch({ requestOptions }, node, schema, { query_string }, {})

    let firstSearchCall = client.child.firstCall
    console.log({ firstSearchCall })

    expect(firstSearchCall.args[0]).to.eql({
      headers: requestOptions.headers,
      requestTimeout: requestOptions.requestTimeout,
    })
  })
})
