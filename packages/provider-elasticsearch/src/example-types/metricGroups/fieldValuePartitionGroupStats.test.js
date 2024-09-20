import fieldValuePartitionGroupStats from './fieldValuePartitionGroupStats.js'
import { testSchema } from '../testUtils.js'
import { expect, describe, it } from 'vitest'

let { buildQuery, drilldown } = fieldValuePartitionGroupStats

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
    ).toEqual({
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
    ).toEqual({
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
  it('should drilldown', () => {
    expect(
      drilldown(
        {
          key: 'test',
          type: 'fieldValuePartitionGroupStats',
          field: 'Vendor.City',
          matchValue: 'Washington',
          drilldown: 'pass',
        },
        testSchema('Vendor.City')
      )
    ).toEqual({
      term: { 'Vendor.City.untouched': 'Washington' },
    })
    expect(
      drilldown(
        {
          key: 'test',
          type: 'fieldValuePartitionGroupStats',
          field: 'Vendor.City',
          matchValue: 'Washington',
          drilldown: 'fail',
        },
        testSchema('Vendor.City')
      )
    ).toEqual({
      bool: { must_not: [{ term: { 'Vendor.City.untouched': 'Washington' } }] },
    })
    expect(
      drilldown(
        {
          key: 'test',
          type: 'fieldValuePartitionGroupStats',
          field: 'Vendor.City',
          matchValue: 'Washington',
          // drilldown: 'pass', <-- should be required?
        },
        testSchema('Vendor.City')
      )
    ).toBeUndefined()
  })
})
