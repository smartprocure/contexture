let {
  buildQuery,
} = require('../../../src/example-types/metricGroups/groupedByValuePartition')
let { expect } = require('chai')

describe('groupedByValuePartition', () => {
  it('should buildQuery', () => {
    expect(
      buildQuery({
        key: 'test',
        type: 'groupedByValuePartition',
        groupField: 'Vendor.City.untouched',
        statsField: 'LineItem.TotalPrice',
        matchValue: 'Washington',
      })
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
      buildQuery({
        key: 'test',
        type: 'groupedByValuePartition',
        groupField: 'Vendor.City.untouched',
        statsField: 'LineItem.TotalPrice',
        matchValue: 'Washington',
        stats: ['cardinality'],
      })
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
