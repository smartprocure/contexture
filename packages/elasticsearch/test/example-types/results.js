/* eslint-env mocha */
let _ = require('lodash/fp')
let F = require('futil-js')
let sequentialResultTest = require('./testUtils').sequentialResultTest

describe('results', () => {
  let schema
  let context
  let service
  let expectedResult
  let expectedCalls
  let resultsTest

  beforeEach(() => {
    service = [
      {
        _scroll_id: 1,
        hits: {
          total: 1,
          hits: [
            {
              _id: 'test-id',
              field: 'test field',
            },
          ],
        },
      },
    ]
    schema = {
      elasticsearch: {
        summaryView: _.identity,
      },
    }
    expectedResult = {
      scrollId: 1,
      response: {
        totalRecords: 1,
        startRecord: 1,
        endRecord: 1,
        results: [
          {
            _id: 'test-id',
            additionalFields: [],
            field: 'test field',
          },
        ],
      },
    }
    context = {
      key: 'test',
      type: 'results',
      config: {
        highlight: false,
        verbose: false,
        explain: false,
      },
    }
    expectedCalls = [
      {
        from: 0,
        size: 10,
        explain: false,
      },
    ]
    resultsTest = _.partial(sequentialResultTest, [
      service,
      _,
      expectedResult,
      _,
      schema,
    ])
  })

  it('should be able to filter fields with config.include', () => {
    F.extendOn(context.config, { include: 'field' })
    resultsTest(context, [
      _.extend(expectedCalls[0], {
        _source: {
          includes: 'field',
        },
        sort: {
          _score: 'desc',
        },
      }),
    ])
    delete context.config.include
    return
  })
  it('should be able to filter fields with config.exclude', () => {
    F.extendOn(context.config, { exclude: 'field' })
    resultsTest(context, [
      _.extend(expectedCalls[0], {
        _source: {
          excludes: 'field',
        },
        sort: {
          _score: 'desc',
        },
      }),
    ])
    delete context.config.exclude
    return
  })

  it('should sort on "_score: desc" with no sortField config', () =>
    resultsTest(context, [
      _.extend(expectedCalls[0], {
        sort: {
          _score: 'desc',
        },
      }),
    ]))
  it('verbose should work', () => {
    F.extendOn(context.config, { verbose: true })
    F.extendOn(expectedResult.response.results, [
      {
        _id: 'test-id',
        additionalFields: [],
        field: 'test field',
        hit: {
          _id: 'test-id',
          field: 'test field',
        },
      },
    ])
    return resultsTest(context, [
      _.extend(expectedCalls[0], {
        sort: {
          _score: 'desc',
        },
      }),
    ])
  })
  it('should order by sortDir config', () => {
    F.extendOn(context.config, { sortDir: 'asc' })
    return resultsTest(context, [
      _.extend(expectedCalls[0], {
        sort: {
          _score: 'asc',
        },
      }),
    ])
  })
  it('should sort on sortField config', () => {
    let sortField = 'test.field'
    F.extendOn(context.config, { sortField })
    return resultsTest(context, [
      _.extend(expectedCalls[0], {
        sort: {
          [context.config.sortField]: 'desc',
        },
      }),
    ])
  })
  it('should strip ".untouched" from sortField config', () => {
    let sortField = 'test.field'
    F.extendOn(context.config, { sortField: `${sortField}.untouched` })
    return resultsTest(context, [
      _.extend(expectedCalls[0], {
        sort: {
          [sortField]: 'desc',
        },
      }),
    ])
  })
  it('should strip ".untouched" from sortField config when sortMode config is "word"', () => {
    let sortField = 'test.field'
    F.extendOn(context.config, { sortField, sortMode: 'word' })
    return resultsTest(context, [
      _.extend(expectedCalls[0], {
        sort: {
          [sortField]: 'desc',
        },
      }),
    ])
  })
  it('should sort on sortField + ".untouched" when sortMode config is "field"', () => {
    let sortField = 'test.field'
    F.extendOn(context.config, { sortField, sortMode: 'field' })
    return resultsTest(context, [
      _.extend(expectedCalls[0], {
        sort: {
          [`${sortField}.untouched`]: 'desc',
        },
      }),
    ])
  })
})
