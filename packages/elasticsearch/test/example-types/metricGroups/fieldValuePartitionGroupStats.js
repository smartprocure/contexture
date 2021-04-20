let {
  buildQuery,
} = require('../../../src/example-types/metricGroups/fieldValuePartitionGroupStats')
let { expect } = require('chai')
let { testSchema } = require('../testUtils')

describe('fieldValuePartitionGroupStats', () => {
  it('should buildQuery', () => {
    expect(
      buildQuery(
        {
          key: 'test',
          type: 'fieldValuePartitionGroupStats',
          groupField: 'Vendor.City',
          statsField: 'LineItem.TotalPrice',
          matchValue: 'Washington',
        },
        testSchema('Vendor.City')
      )
    ).to.eql({
      aggs: {
        groups: {
          filters: {
            other_bucket_key: 'fail',
            filters: {
              pass: { term: { 'Vendor.City.untouched': 'Washington' } },
            },
          },
          aggs: {
            min: { min: { field: 'LineItem.TotalPrice' } },
            max: { max: { field: 'LineItem.TotalPrice' } },
            avg: { avg: { field: 'LineItem.TotalPrice' } },
            sum: { sum: { field: 'LineItem.TotalPrice' } },
          },
        },
      },
    })
  })
  it('should buildQuery for cardinality', () => {
    expect(
      buildQuery(
        {
          key: 'test',
          type: 'fieldValuePartitionGroupStats',
          groupField: 'Vendor.City',
          statsField: 'LineItem.TotalPrice',
          matchValue: 'Washington',
          stats: ['cardinality'],
        },
        testSchema('Vendor.City')
      )
    ).to.eql({
      aggs: {
        groups: {
          filters: {
            other_bucket_key: 'fail',
            filters: {
              pass: { term: { 'Vendor.City.untouched': 'Washington' } },
            },
          },
          aggs: {
            cardinality: { cardinality: { field: 'LineItem.TotalPrice' } },
          },
        },
      },
    })
  })
})
