const twoLevelMatch = require('../../src/example-types/twoLevelMatch')
const utils = require('./testUtils')
let { expect } = require('chai')

describe('twoLevelMatch', function() {
  describe('validContext', function() {
    it('should validate a context with config key_field, value_field and key_value', function() {
      expect(
        twoLevelMatch.validContext({
          key_field: true,
          value_field: true,
          key_value: true,
        })
      ).to.be.true
    })
    it('any context missing a config value for key_field, value_field or key_value should be invalid', function() {
      utils.noValidContexts(twoLevelMatch)([
        {
          key_field: true,
          value_field: true,
          key_value: false,
        },
        {
          key_field: true,
          value_field: true,
        },
        {
          key_field: true,
          key_value: true,
          value_field: false,
        },
        {
          key_field: true,
          key_value: true,
        },
        {
          value_field: true,
          key_value: true,
          key_field: false,
        },
        {
          value_field: true,
          key_value: true,
        },
      ])
    })
  })

  describe('result', function() {
    const context = {
      key: 'test',
      type: 'twoLevelMatch',
      key_field: 'Vendor.City.untouched',
      value_field: 'LineItem.TotalPrice',
      value_type: 'stats',
      key_value: 'Washington',
    }

    const callsArguments = [
      {
        aggs: {
          twoLevelAgg: {
            aggs: {
              twoLevelAgg: {
                stats: {
                  field: 'LineItem.TotalPrice',
                },
              },
            },
            filters: {
              filters: {
                fail: {
                  bool: {
                    must_not: {
                      term: {
                        'Vendor.City.untouched': 'Washington',
                      },
                    },
                  },
                },
                pass: {
                  term: {
                    'Vendor.City.untouched': 'Washington',
                  },
                },
              },
            },
          },
        },
      },
    ]

    it('works for stub config values and gets the expected structure (empty results)', function() {
      return utils.sequentialResultTest(
        [
          {
            aggregations: {
              twoLevelAgg: {
                buckets: [],
              },
            },
          },
        ],
        context,
        { results: [] },
        callsArguments
      )
    })
    it('works for stub config values and gets the expected structure (two results)', function() {
      return utils.sequentialResultTest(
        [
          {
            aggregations: {
              twoLevelAgg: {
                buckets: {
                  pass: {
                    doc_count: 50,
                    twoLevelAgg: {
                      count: 6,
                      min: 60,
                      max: 98,
                      avg: 78.5,
                      sum: 471,
                    },
                  },
                  fail: {
                    doc_count: 50,
                    twoLevelAgg: {
                      count: 6,
                      min: 60,
                      max: 98,
                      avg: 78.5,
                      sum: 471,
                    },
                  },
                },
              },
            },
          },
        ],
        context,
        {
          results: [
            {
              avg: 78.5,
              count: 6,
              doc_count: 50,
              key: 'pass',
              max: 98,
              min: 60,
              sum: 471,
            },
            {
              avg: 78.5,
              count: 6,
              doc_count: 50,
              key: 'fail',
              max: 98,
              min: 60,
              sum: 471,
            },
          ],
        },
        callsArguments
      )
    })
  })
})
