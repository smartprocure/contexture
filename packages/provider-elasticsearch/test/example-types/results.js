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

  it('should be able to filter fields with include', () => {
    F.extendOn(context, { include: 'field' })
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
    delete context.include
    return
  })
  it('should be able to filter fields with exclude', () => {
    F.extendOn(context, { exclude: 'field' })
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
    delete context.exclude
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
    return resultsTest(context, [
      _.extend(expectedCalls[0], {
        sort: {
          _score: 'desc',
        },
      }),
    ])
  })
  it('should order by sortDir config', () => {
    F.extendOn(context, { sortDir: 'asc' })
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
    F.extendOn(context, { sortField })
    return resultsTest(context, [
      _.extend(expectedCalls[0], {
        sort: {
          [context.sortField]: 'desc',
        },
      }),
    ])
  })
  it('should strip ".untouched" from sortField config', () => {
    let sortField = 'test.field'
    F.extendOn(context, { sortField: `${sortField}.untouched` })
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
    F.extendOn(context, { sortField, sortMode: 'word' })
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
    F.extendOn(context, { sortField, sortMode: 'field' })
    return resultsTest(context, [
      _.extend(expectedCalls[0], {
        sort: {
          [`${sortField}.untouched`]: 'desc',
        },
      }),
    ])
  })
  // it.only('should populate', () => {
  //   let sortField = 'test.field'
  //   F.extendOn(context, { populate: {
  //     test: {
  //       localField: 'local',
  //       foreignField: 'foreign',
  //       schema: 'targetSchema'
  //     }
  //   } })
  //   return resultsTest(context, [
  //     _.extend(expectedCalls[0], {
  //       sort: {
  //         [`${sortField}.untouched`]: 'desc',
  //       },
  //     }),
  //   ])
  // })
})
