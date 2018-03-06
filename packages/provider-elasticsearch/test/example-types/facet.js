let _ = require('lodash/fp')
let facet = require('../../src/example-types/facet')
let sequentialResultTest = require('./testUtils').sequentialResultTest
let { expect } = require('chai')
let facetTest = sequentialResultTest([
  {
    aggregations: {
      facetOptions: {
        buckets: [
          {
            key: 'a',
            doc_count: 10,
          },
          {
            key: 'b',
            doc_count: 10,
          },
          {
            key: 'c',
            doc_count: 10,
          },
        ],
      },
      facetCardinality: {
        value: 10,
      },
    },
  },
  {
    aggregations: {
      facetAggregation: {
        doc_count: 20,
        facetOptions: {
          buckets: [
            {
              key: 'x',
              doc_count: 10,
            },
            {
              key: 'y',
              doc_count: 10,
            },
          ],
        },
        facetCardinality: {
          value: 10,
        },
      },
    },
  },
])

describe('facet', () => {
  describe('filter', () => {
    it('simple', () =>
      expect(
        facet.filter({
          key: 'test',
          type: 'facet',
          field: 'testField',
          values: ['abc', '123'],
        })
      ).to.deep.equal({
        terms: {
          'testField.untouched': ['abc', '123'],
        },
      }))

    it('exclude', () =>
      expect(
        facet.filter({
          key: 'test',
          type: 'facet',
          field: 'testField',
          mode: 'exclude',
          values: ['abc', '123'],
        })
      ).to.deep.equal({
        bool: {
          must_not: {
            terms: {
              'testField.untouched': ['abc', '123'],
            },
          },
        },
      }))

    let values = _.times(_.random, 5000)
    it('number of values exceeds 4095', () =>
      expect(
        facet.filter({
          key: 'test',
          type: 'facet',
          field: 'testField',
          values,
        })
      ).to.deep.equal({
        bool: {
          filter: {
            terms: {
              'testField.untouched': values,
            },
          },
        },
      }))
  })
  describe('results generation', () => {
    it('simple', () =>
      facetTest(
        {
          key: 'test',
          type: 'facet',
          field: 'testField.untouched',
          values: ['a'],
        },
        {
          cardinality: 10,
          options: [
            {
              name: 'a',
              count: 10,
            },
            {
              name: 'b',
              count: 10,
            },
            {
              name: 'c',
              count: 10,
            },
          ],
        },
        [
          {
            aggs: {
              facetOptions: {
                terms: {
                  field: 'testField.untouched',
                  size: 10,
                  order: {
                    _count: 'desc',
                  },
                },
              },
              facetCardinality: {
                cardinality: {
                  field: 'testField.untouched',
                  precision_threshold: 5000,
                },
              },
            },
          },
        ]
      ))

    it('missing values', () =>
      facetTest(
        {
          key: 'test',
          type: 'facet',
          field: 'testField',
          values: ['a', 'x', 'y', 'z'],
        },
        {
          cardinality: 10,
          options: [
            {
              name: 'a',
              count: 10,
            },
            {
              name: 'b',
              count: 10,
            },
            {
              name: 'c',
              count: 10,
            },
            {
              name: 'x',
              count: 10,
            },
            {
              name: 'y',
              count: 10,
            },
            {
              name: 'z',
              count: 0,
            },
          ],
        },
        [
          {
            aggs: {
              facetOptions: {
                terms: {
                  field: 'testField.untouched',
                  size: 10,
                  order: {
                    _count: 'desc',
                  },
                },
              },
              facetCardinality: {
                cardinality: {
                  field: 'testField.untouched',
                  precision_threshold: 5000,
                },
              },
            },
          },
          {
            aggs: {
              facetAggregation: {
                filter: {
                  terms: {
                    'testField.untouched': ['x', 'y', 'z'],
                  },
                },
                aggs: {
                  facetOptions: {
                    terms: {
                      field: 'testField.untouched',
                      size: 3,
                      order: {
                        _count: 'desc',
                      },
                    },
                  },
                },
              },
            },
          },
        ]
      ))

    it('find filter box', () =>
      sequentialResultTest(
        [
          {
            /* This is the raw query response from ES. */
            aggregations: {
              facetCardinality: {
                value: 958,
              },
              facetOptions: {
                buckets: [
                  {
                    key: 'Oklahoma State Health Care Authority, OK',
                    doc_count: 2552446,
                  },
                  {
                    key:
                      'Virginia Polytechnic Institute And State University, VA',
                    doc_count: 1358257,
                  },
                ],
              },
            },
          },
        ],
        {
          /* This is the data context generated by the client which could be transformed into one or more ES queries. */
          key: 'wildCardTest',
          type: 'facet',
          field: 'Organization.NameState.untouched',
          mode: 'include',
          values: [],
          size: 2,
          optionsFilter: 'state',
        },
        {
          /* This is the payload the server sends to the web client. This is the result after the
                raw response from ES gets transformed. */
          cardinality: 958,
          options: [
            {
              name: 'Oklahoma State Health Care Authority, OK',
              count: 2552446,
            },
            {
              name: 'Virginia Polytechnic Institute And State University, VA',
              count: 1358257,
            },
          ],
        },
        [
          {
            /* This is the payload that gets sent to ES by the server side search.
                In this case there is only one but there could be potentially more. */
            aggs: {
              topLevelFilter: {
                filter: {
                  bool: {
                    must: [
                      {
                        regexp: {
                          'Organization.NameState.untouched':
                            '.*[Ss][Tt][Aa][Tt][Ee].*',
                        },
                      },
                    ],
                  },
                },
                aggs: {
                  facetCardinality: {
                    cardinality: {
                      field: 'Organization.NameState.untouched',
                      precision_threshold: 5000,
                    },
                  },
                  facetOptions: {
                    terms: {
                      field: 'Organization.NameState.untouched',
                      include: '.*([Ss][Tt][Aa][Tt][Ee]).*',
                      order: {
                        _count: 'desc',
                      },
                      size: 2,
                    },
                  },
                },
              },
            },
          },
        ]
      ))

    it('find filter box with a longer optionsFilter', () =>
      sequentialResultTest(
        [
          {
            /* This is the raw query response from ES. */
            aggregations: {
              facetCardinality: {
                value: 958,
              },
              facetOptions: {
                buckets: [
                  {
                    key: 'Oklahoma State Health Care Authority, OK',
                    doc_count: 2552446,
                  },
                  {
                    key:
                      'Virginia Polytechnic Institute And State University, VA',
                    doc_count: 1358257,
                  },
                ],
              },
            },
          },
        ],
        {
          /* This is the data context generated by the client which could be transformed into one or more ES queries. */
          key: 'wildCardTest',
          type: 'facet',
          field: 'Organization.NameState.untouched',
          mode: 'include',
          values: [],
          size: 2,
          optionsFilter: 'state 1 2 3',
        },
        {
          /* This is the payload the server sends to the web client. This is the result after the
                raw response from ES gets transformed. */
          cardinality: 958,
          options: [
            {
              name: 'Oklahoma State Health Care Authority, OK',
              count: 2552446,
            },
            {
              name: 'Virginia Polytechnic Institute And State University, VA',
              count: 1358257,
            },
          ],
        },
        [
          {
            /* This is the payload that gets sent to ES by the server side search.
                In this case there is only one but there could be potentially more. */
            aggs: {
              topLevelFilter: {
                filter: {
                  bool: {
                    must: [
                      {
                        regexp: {
                          'Organization.NameState.untouched':
                            '.*[Ss][Tt][Aa][Tt][Ee].*',
                        },
                      },
                      {
                        regexp: {
                          'Organization.NameState.untouched': '.*1.*',
                        },
                      },
                      {
                        regexp: {
                          'Organization.NameState.untouched': '.*2.*',
                        },
                      },
                      {
                        regexp: {
                          'Organization.NameState.untouched': '.*3.*',
                        },
                      },
                    ],
                  },
                },
                aggs: {
                  facetCardinality: {
                    cardinality: {
                      field: 'Organization.NameState.untouched',
                      precision_threshold: 5000,
                    },
                  },
                  facetOptions: {
                    terms: {
                      field: 'Organization.NameState.untouched',
                      include: '.*[Ss][Tt][Aa][Tt][Ee].*1.*2.*3.*',
                      order: {
                        _count: 'desc',
                      },
                      size: 2,
                    },
                  },
                },
              },
            },
          },
        ]
      ))
  })
})
