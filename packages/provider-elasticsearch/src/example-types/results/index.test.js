import _ from 'lodash/fp.js'
import F from 'futil'
import { sequentialResultTest } from '../testUtils.js'
import { hoistOnTree } from '../../utils/results.js'

describe('results', () => {
  let schema
  let node
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
              _score: 'test-score',
              field: 'test field',
            },
          ],
        },
      },
    ]
    schema = {
      elasticsearch: {},
    }
    expectedResult = {
      scrollId: 1,
      totalRecords: 1,
      startRecord: 1,
      endRecord: 1,
      results: [
        {
          _id: 'test-id',
          _score: 'test-score',
          field: 'test field',
        },
      ],
    }
    node = {
      key: 'test',
      type: 'results',
      verbose: false,
      explain: false,
    }
    expectedCalls = [
      {
        from: 0,
        size: 10,
        explain: false,
        track_total_hits: true,
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
    F.extendOn(node, { include: ['field'] })
    await resultsTest(node, [
      _.extend(expectedCalls[0], {
        _source: {
          includes: ['field'],
        },
        sort: {
          _score: 'desc',
        },
      }),
    ])
    delete node.include
  })
  it('should be able to filter fields with exclude', async () => {
    F.extendOn(node, { exclude: 'field' })
    await resultsTest(node, [
      _.extend(expectedCalls[0], {
        _source: {
          excludes: 'field',
        },
        sort: {
          _score: 'desc',
        },
      }),
    ])
    delete node.exclude
  })
  it('should skip highlight when node highlight is false', async () => {
    schema.elasticsearch.highlight = {}
    F.extendOn(node, { highlight: false })
    await resultsTest(node, [
      _.extend(expectedCalls[0], { sort: { _score: 'desc' } }),
    ])
  })
  it('should sort on "_score: desc" with no sortField config', () =>
    resultsTest(node, [{ ...expectedCalls[0], sort: { _score: 'desc' } }]))
  it('should order by sortDir config', async () => {
    F.extendOn(node, { sortDir: 'asc' })
    await resultsTest(node, [{ ...expectedCalls[0], sort: { _score: 'asc' } }])
  })
  it('should sort on sortField config', async () => {
    let sortField = 'test.field'
    F.extendOn(node, { sortField })
    await resultsTest(node, [
      { ...expectedCalls[0], sort: { [node.sortField]: 'desc' } },
    ])
  })

  it('should add ".untouched" suffix from schema notAnalyzedField', async () => {
    let sortField = 'test.field'
    F.extendOn(node, { sortField })
    F.extendOn(schema, {
      fields: {
        [sortField]: {
          elasticsearch: {
            notAnalyzedField: 'untouched',
          },
        },
      },
    })
    await resultsTest(node, [
      _.extend(expectedCalls[0], {
        sort: {
          [`${sortField}.untouched`]: 'desc',
        },
      }),
    ])
  })
  it('should strip ".untouched" from sortField config when sortMode config is "word"', async () => {
    let sortField = 'test.field'
    F.extendOn(node, { sortField, sortMode: 'word' })
    await resultsTest(node, [
      _.extend(expectedCalls[0], {
        sort: {
          [sortField]: 'desc',
        },
      }),
    ])
  })

  it('Should hoist from tree based on demarcation for hoisting from aggs', () => {
    let input = {
      aggs: {
        groups: {
          date_histogram: {
            field: 'PO.IssuedDate.fiscal',
            interval: 'year',
            min_doc_count: 0,
            __hoistProps: {
              runtime_mappings: {
                'PO.IssuedDate.fiscal': {
                  script: {
                    params: { monthOffset: 3 },
                    source: `if(doc['PO.IssuedDate'].size()!=0){${''}emit(doc['PO.IssuedDate']${''}.value.plusMonths(params['monthOffset']).toInstant().toEpochMilli())}${''}`,
                  },
                  type: 'date',
                },
              },
            },
          },
          aggs: {
            min: { min: { field: 'LineItem.TotalPrice' } },
            max: { max: { field: 'LineItem.TotalPrice' } },
            avg: { avg: { field: 'LineItem.TotalPrice' } },
            sum: {
              sum: {
                field: 'LineItem.TotalPrice',
                __hoistProps: {
                  runtime_mappings: {
                    'PO.OtherDate.fiscal': {
                      script: {
                        params: { monthOffset: 3 },
                        source: `if(doc['PO.OtherDate'].size()!=0){${''}emit(doc['PO.OtherDate']${''}.value.plusMonths(params['monthOffset']).toInstant().toEpochMilli())}${''}`,
                      },
                      type: 'date',
                    },
                  },
                },
              },
            },
          },
        },
      },
    }

    let output = {
      result: {
        aggs: {
          groups: {
            date_histogram: {
              field: 'PO.IssuedDate.fiscal',
              interval: 'year',
              min_doc_count: 0,
            },
            aggs: {
              min: { min: { field: 'LineItem.TotalPrice' } },
              max: { max: { field: 'LineItem.TotalPrice' } },
              avg: { avg: { field: 'LineItem.TotalPrice' } },
              sum: { sum: { field: 'LineItem.TotalPrice' } },
            },
          },
        },
      },
      removed: [
        {
          runtime_mappings: {
            'PO.IssuedDate.fiscal': {
              script: {
                params: { monthOffset: 3 },
                source: `if(doc['PO.IssuedDate'].size()!=0){${''}emit(doc['PO.IssuedDate']${''}.value.plusMonths(params['monthOffset']).toInstant().toEpochMilli())}${''}`,
              },
              type: 'date',
            },
          },
        },
        {
          runtime_mappings: {
            'PO.OtherDate.fiscal': {
              script: {
                params: { monthOffset: 3 },
                source: `if(doc['PO.OtherDate'].size()!=0){${''}emit(doc['PO.OtherDate']${''}.value.plusMonths(params['monthOffset']).toInstant().toEpochMilli())}${''}`,
              },
              type: 'date',
            },
          },
        },
      ],
    }
    let result = { result: input, removed: hoistOnTree(input) }
    expect(result).toEqual(output)
  })

  it('Should hoist from tree based on demarcation for hoisting from filters', () => {
    let input = {
      index: 'sp-data-lit',
      body: {
        query: {
          constant_score: {
            filter: {
              bool: {
                should: [
                  {
                    bool: {
                      must: [
                        {
                          __hoistProps: {
                            runtime_mappings: {
                              'FederalDoc.relevantContractDates.signedDate.fiscal':
                                {
                                  type: 'date',
                                  script: {
                                    source:
                                      "if(doc['FederalDoc.relevantContractDates.signedDate'].size()!=0){emit(doc['FederalDoc.relevantContractDates.signedDate'].value.plusMonths(params['monthOffset']).toInstant().toEpochMilli())}",
                                    params: {
                                      monthOffset: 3,
                                    },
                                  },
                                },
                            },
                          },
                          range: {
                            'FederalDoc.relevantContractDates.signedDate.fiscal':
                              {
                                gte: '2015-04-01T00:00:00.000Z',
                                lte: '2015-06-30T23:59:59Z',
                              },
                          },
                        },
                      ],
                    },
                  },
                ],
                minimum_should_match: 1,
              },
            },
          },
        },
      },
    }
    let output = {
      result: {
        index: 'sp-data-lit',
        body: {
          query: {
            constant_score: {
              filter: {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          {
                            range: {
                              'FederalDoc.relevantContractDates.signedDate.fiscal':
                                {
                                  gte: '2015-04-01T00:00:00.000Z',
                                  lte: '2015-06-30T23:59:59Z',
                                },
                            },
                          },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            },
          },
        },
      },
      removed: [
        {
          runtime_mappings: {
            'FederalDoc.relevantContractDates.signedDate.fiscal': {
              type: 'date',
              script: {
                source:
                  "if(doc['FederalDoc.relevantContractDates.signedDate'].size()!=0){emit(doc['FederalDoc.relevantContractDates.signedDate'].value.plusMonths(params['monthOffset']).toInstant().toEpochMilli())}",
                params: {
                  monthOffset: 3,
                },
              },
            },
          },
        },
      ],
    }

    let result = { result: input, removed: hoistOnTree(input) }
    expect(result).toEqual(output)
  })
})
