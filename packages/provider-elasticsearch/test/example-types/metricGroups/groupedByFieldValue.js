let {
  buildQuery,
} = require('../../../src/example-types/metricGroups/groupedByFieldValue')
let { expect } = require('chai')

describe('groupedByFieldValue', () => {
  it('should buildQuery', () => {
    expect(
      buildQuery(
        {
          key: 'test',
          type: 'groupedByFieldValue',
          groupField: 'Organization.Name',
          statsField: 'LineItem.TotalPrice',
        },
        {
          fields: {
            'Organization.Name': {
              elasticsearch: { notAnalyzedField: 'untouched' },
            },
          },
        }
      )
    ).to.eql({
      aggs: {
        groups: {
          terms: {
            field: 'Organization.Name.untouched',
            size: 10,
            order: { 'sum.value': 'desc' },
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
  it('should sort', () => {
    expect(
      buildQuery({
        key: 'test',
        type: 'groupedByFieldValue',
        groupField: 'Organization.Name',
        statsField: 'LineItem.TotalPrice',
        sort: { field: 'max', order: 'asc' },
      })
    ).to.eql({
      aggs: {
        groups: {
          terms: {
            field: 'Organization.Name',
            size: 10,
            order: { 'max.value': 'asc' },
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
  it('should sort by count', () => {
    expect(
      buildQuery({
        key: 'test',
        type: 'groupedByFieldValue',
        groupField: 'Organization.Name',
        sort: { field: 'count' },
      })
    ).to.eql({
      aggs: {
        groups: {
          terms: {
            field: 'Organization.Name',
            size: 10,
            order: { _count: 'desc' },
          },
        },
      },
    })
  })
  it('should sort by key', () => {
    expect(
      buildQuery({
        key: 'test',
        type: 'groupedByFieldValue',
        groupField: 'Organization.Name',
        sort: { field: 'key' },
      })
    ).to.eql({
      aggs: {
        groups: {
          terms: {
            field: 'Organization.Name',
            size: 10,
            order: { _key: 'desc' },
          },
        },
      },
    })
  })
  it('should buildQuery with filter', () => {
    expect(
      buildQuery({
        key: 'test',
        type: 'groupedByFieldValue',
        groupField: 'Organization.Name',
        statsField: 'LineItem.TotalPrice',
        filter: 'city',
        stats: ['sum'],
        size: 20,
      })
    ).to.eql({
      aggs: {
        valueFilter: {
          filter: {
            bool: {
              must: [
                { regexp: { 'Organization.Name': '.*([Cc][Ii][Tt][Yy]).*' } },
              ],
            },
          },
          aggs: {
            groups: {
              terms: {
                field: 'Organization.Name',
                size: 20,
                order: { 'sum.value': 'desc' },
              },
              aggs: { sum: { sum: { field: 'LineItem.TotalPrice' } } },
            },
          },
        },
      },
    })
  })
  it('should buildQuery with filter with ridiculous spaces', () => {
    expect(
      buildQuery({
        key: 'test',
        type: 'groupedByFieldValue',
        groupField: 'Organization.Name',
        statsField: 'LineItem.TotalPrice',
        filter: 'city   of    ',
        stats: ['sum'],
      })
    ).to.eql({
      aggs: {
        valueFilter: {
          filter: {
            bool: {
              must: [
                { regexp: { 'Organization.Name': '.*([Cc][Ii][Tt][Yy]).*' } },
                { regexp: { 'Organization.Name': '.*([Oo][Ff]).*' } },
              ],
            },
          },
          aggs: {
            groups: {
              terms: {
                field: 'Organization.Name',
                size: 10,
                order: { 'sum.value': 'desc' },
              },
              aggs: { sum: { sum: { field: 'LineItem.TotalPrice' } } },
            },
          },
        },
      },
    })
  })
})
