let { expect } = require('chai')
let Contexture = require('../src/index')
let provider = require('../src/provider-debug')

describe('Contexture Core', () => {
  let process = Contexture({
    schemas: {
      test: {
        debug: true,
      },
    },
    providers: {
      debug: provider,
    },
  })
  let dsl = {
    key: 'root',
    type: 'group',
    schema: 'test',
    // join: 'and',
    items: [
      {
        key: 'filter',
        type: 'test',
        data: {
          value: 1,
        },
      },
      {
        key: 'results',
        type: 'results',
      },
    ],
  }
  it('should work', async () => {
    let { items: [filter, results] } = await process(dsl)
    expect(filter.context).to.deep.equal({
      abc: 123,
    })
    expect(filter._meta).to.not.exist
    expect(results.context).to.deep.equal({
      results: [],
    })
    expect(results._meta).to.not.exist
  })
  it('should add _meta with debug option', async () => {
    let result = await process(dsl, { debug: true })
    let { items: [filter, results] } = result

    expect(filter._meta).to.deep.equal({
      requests: [
        {
          where: undefined,
          retrieve: { test: {} },
        },
      ],
      path: ['root', 'filter'],
      hasValue: true,
      relevantFilters: undefined,
      filter: {
        'filter (test)': {
          value: 1,
        },
      },
    })
    expect(results._meta).to.deep.equal({
      requests: [
        {
          where: {
            'filter (test)': {
              value: 1,
            },
          },
          retrieve: {
            results: {},
          },
        },
      ],
      path: ['root', 'results'],
      hasValue: true,
      relevantFilters: {
        'filter (test)': {
          value: 1,
        },
      },
      filter: undefined,
    })
  })
})
