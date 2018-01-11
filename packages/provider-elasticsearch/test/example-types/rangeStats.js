const rangeStats = require('../../src/example-types/rangeStats')
const _ = require('lodash/fp')
const utils = require('./testUtils')

describe('rangeStats', () => {
  describe('validContext', () => {
    it('should validate a context with config key_field, value_field and ranges', () => {
      utils.validContexts(rangeStats)([
        {
          key_field: true,
          value_field: true,
          ranges: true,
        },
        {
          key_field: 'key_field',
          value_field: 'value_field',
          ranges: [1],
        },
      ])
    })
    it('should validate a context without config key_field, value_field or ranges', () => {
      utils.noValidContexts(rangeStats)([
        {
          key_field: true,
          value_field: true,
          ranges: false,
        },
        {
          key_field: true,
          value_field: true,
        },
        {
          key_field: true,
          value_field: false,
          ranges: true,
        },
        {
          key_field: true,
          ranges: true,
        },
        {
          key_field: false,
          value_field: true,
          ranges: true,
        },
        {
          value_field: true,
          ranges: true,
        },
      ])
    })
  })

  describe('validContext', () => {
    const test = _.curry(utils.sequentialResultTest)([
      {
        aggregations: {
          twoLevelAgg: {
            buckets: [
              {
                key: '0.0-500.0',
                from: 0,
                from_as_string: '0.0',
                to: 500,
                to_as_string: '500.0',
                doc_count: 476899106,
                twoLevelAgg: {
                  count: 476899106,
                  min: -500000000,
                  max: 937998784,
                  avg: 973.7296742278231,
                  sum: 464370811124.9201,
                },
              },
              {
                key: '500.0-10000.0',
                from: 500,
                from_as_string: '500.0',
                to: 10000,
                to_as_string: '10000.0',
                doc_count: 110489302,
                twoLevelAgg: {
                  count: 110489302,
                  min: -999299968,
                  max: 2100000000,
                  avg: 3038.799582495458,
                  sum: 335754844787.8146,
                },
              },
            ],
          },
        },
      },
    ])
    it('should work', () =>
      test(
        {
          key: 'test',
          type: 'rangeStats',
          key_field: 'LineItem.UnitPrice',
          value_field: 'LineItem.TotalPrice',
          ranges: [
            {
              from: '0',
              to: '500',
            },
            {
              from: '500',
              to: '10000',
            },
          ],
        },
        {
          results: [
            {
              key: '0.0-500.0',
              doc_count: 476899106,
              count: 476899106,
              min: -500000000,
              max: 937998784,
              avg: 973.7296742278231,
              sum: 464370811124.9201,
            },
            {
              key: '500.0-10000.0',
              doc_count: 110489302,
              count: 110489302,
              min: -999299968,
              max: 2100000000,
              avg: 3038.799582495458,
              sum: 335754844787.8146,
            },
          ],
        },
        [
          {
            aggs: {
              twoLevelAgg: {
                range: {
                  field: 'LineItem.UnitPrice',
                  ranges: [
                    {
                      from: '0',
                      to: '500',
                    },
                    {
                      from: '500',
                      to: '10000',
                    },
                  ],
                },
                aggs: {
                  twoLevelAgg: {
                    stats: {
                      field: 'LineItem.TotalPrice',
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
