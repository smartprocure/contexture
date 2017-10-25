let sinon = require('sinon')
let provider = require('../src/index')
let { expect } = require('chai')

describe('Core Provider', () => {
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
  it('runSearch should wrap queries in constant_score if sort._score is not present', () => {
    const client = {
      search: sinon.stub().returns(Promise.resolve({})),
    }

    const context = { config: {}, _meta: { requests: [] } }
    const schema = { elasticsearch: {} }

    const query_string = {
      default_field: 'FieldGroup.POLineItem',
      default_operator: 'AND',
      query: 'something',
    }

    provider({
      getClient: () => client,
    }).runSearch({}, context, schema, { query_string }, {})

    expect(
      client.search.getCalls(0)[0].args[0].body.query.constant_score.filter
    ).to.eql({ query_string })
  })
  it('runSearch should not wrap queries in constant_score if no query is given', () => {
    const client = {
      search: sinon.stub().returns(Promise.resolve({})),
    }

    const context = { config: {}, _meta: { requests: [] } }
    const schema = { elasticsearch: {} }

    provider({
      getClient: () => client,
    }).runSearch({}, context, schema, null, {})

    expect(client.search.getCalls(0)[0].args[0].body).to.eql({ query: null })
  })
  it('runSearch should not wrap queries in constant_score if sort._score is present', () => {
    const client = {
      search: sinon.stub().returns(Promise.resolve({})),
    }

    const context = { config: {}, _meta: { requests: [] } }
    const schema = { elasticsearch: {} }

    const query_string = {
      default_field: 'FieldGroup.POLineItem',
      default_operator: 'AND',
      query: 'something',
    }

    provider({
      getClient: () => client,
    }).runSearch(
      {},
      context,
      schema,
      { query_string },
      { sort: { _score: 'desc' } }
    )

    expect(client.search.getCalls(0)[0].args[0].body.query).to.eql({
      query_string,
    })
  })
})
