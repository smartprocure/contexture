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
      highlight: false,
      verbose: false,
      explain: false,
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

  it('should be able to filter fields with include', async () => {
    F.extendOn(context, { include: 'field' })
    expectedResult.response.results[0].hit = {
      _id: 'test-id',
      field: 'test field',
    }
    await resultsTest(context, [
      _.extend(expectedCalls[0], {
        _source: {
          includes: 'field',
        },
        sort: {
          _score: 'desc',
        },
      }),
    ])
    delete context.include
  })
  it('should be able to filter fields with exclude', async () => {
    F.extendOn(context, { exclude: 'field' })
    await resultsTest(context, [
      _.extend(expectedCalls[0], {
        _source: {
          excludes: 'field',
        },
        sort: {
          _score: 'desc',
        },
      }),
    ])
    delete context.exclude
  })
  it('should highlight additionalFields if showOtherMatches is set', async () => {
    schema.elasticsearch.highlight = { test: ['field'] }
    service[0].hits.hits[0].anotherField = 'test another field'
    F.extendOn(context, { showOtherMatches: true, include: 'anotherField', highlight: true })
    expectedResult.response.results[0].anotherField = 'test another field'
    expectedResult.response.results[0].hit = {
      _id: 'test-id',
      field: 'test field',
      anotherField: 'test another field'
    }
    await resultsTest(context, [
      _.extend(expectedCalls[0], {
        _source: {
          includes: 'anotherField',
        },
        sort: {
          _score: 'desc',
        },
        highlight: {
          fields: {
            field: {}
          },
          number_of_fragments: 0,
          post_tags: [
            "</b>"
          ],
          pre_tags: [
            "<b>"
          ],
          require_field_match: false
        }
      }),
    ])
  })
  it('should not highlight additionalFields if showOtherMatches is not set', async () => {
    schema.elasticsearch.highlight = { test: ['field'] }
    service[0].hits.hits[0].anotherField = 'test another field'
    F.extendOn(context, { include: 'anotherField', highlight: true })
    expectedResult.response.results[0].anotherField = 'test another field'
    expectedResult.response.results[0].hit = {
      _id: 'test-id',
      field: 'test field',
      anotherField: 'test another field'
    }
    await resultsTest(context, [
      _.extend(expectedCalls[0], {
        _source: {
          includes: 'anotherField',
        },
        sort: {
          _score: 'desc',
        },
        highlight: {
          fields: {},
          number_of_fragments: 0,
          post_tags: [
            "</b>"
          ],
          pre_tags: [
            "<b>"
          ],
          require_field_match: false
        }
      }),
    ])
  })
  it('should sort on "_score: desc" with no sortField config', async () =>
   resultsTest(context, [
      _.extend(expectedCalls[0], {
        sort: {
          _score: 'desc',
        },
      }),
    ]))
  it('verbose should work', async () => {
    F.extendOn(context, { verbose: true })
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
    await resultsTest(context, [
      _.extend(expectedCalls[0], {
        sort: {
          _score: 'desc',
        },
      }),
    ])
  })
  it('should order by sortDir config', async () => {
    F.extendOn(context, { sortDir: 'asc' })
    await resultsTest(context, [
      _.extend(expectedCalls[0], {
        sort: {
          _score: 'asc',
        },
      }),
    ])
  })
  it('should sort on sortField config', async () => {
    let sortField = 'test.field'
    F.extendOn(context, { sortField })
    await resultsTest(context, [
      _.extend(expectedCalls[0], {
        sort: {
          [context.sortField]: 'desc',
        },
      }),
    ])
  })
  it('should strip ".untouched" from sortField config', async () => {
    let sortField = 'test.field'
    F.extendOn(context, { sortField: `${sortField}.untouched` })
    await resultsTest(context, [
      _.extend(expectedCalls[0], {
        sort: {
          [sortField]: 'desc',
        },
      }),
    ])
  })
  it('should add ".untouched" suffix from schema notAnalyzedField', async () => {
    let sortField = 'test.field'
    F.extendOn(context, { sortField })
    F.extendOn(schema, {
      fields: {
        [sortField]: {
          elasticsearch: {
            notAnalyzedField: 'untouched',
          },
        },
      },
    })
    await resultsTest(context, [
      _.extend(expectedCalls[0], {
        sort: {
          [`${sortField}.untouched`]: 'desc',
        },
      }),
    ])
  })
  it('should strip ".untouched" from sortField config when sortMode config is "word"', async () => {
    let sortField = 'test.field'
    F.extendOn(context, { sortField, sortMode: 'word' })
    await resultsTest(context, [
      _.extend(expectedCalls[0], {
        sort: {
          [sortField]: 'desc',
        },
      }),
    ])
  })
  it('should sort on sortField + ".untouched" when sortMode config is "field"', async () => {
    let sortField = 'test.field'
    F.extendOn(context, { sortField, sortMode: 'field' })
    await resultsTest(context, [
      _.extend(expectedCalls[0], {
        sort: {
          [`${sortField}.untouched`]: 'desc',
        },
      }),
    ])
  })
  it('forceExclude', async () => {
    F.extendOn(context, { forceExclude: true })
    let excludes = ['a', 'b', 'c']
    F.extendOn(schema, { forceExclude: excludes })
    await resultsTest(context, [
      _.extend(expectedCalls[0], {
        _source: {
          excludes,
        },
        sort: {
          _score: 'desc',
        },
      }),
    ])
  })
})
