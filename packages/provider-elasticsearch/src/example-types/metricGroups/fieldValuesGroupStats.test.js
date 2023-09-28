import fieldValuesGroupStats from './fieldValuesGroupStats.js'
import { testSchema } from '../testUtils.js'

let { buildQuery, buildGroupQuery } = fieldValuesGroupStats

describe('fieldValuesGroupStats', () => {
  it('should buildQuery', () => {
    expect(
      buildQuery(
        {
          key: 'test',
          type: 'fieldValuesGroupStats',
          groupField: 'Organization.Name',
          statsField: 'LineItem.TotalPrice',
        },
        testSchema('Organization.Name')
      )
    ).toEqual({
      aggs: {
        groups: {
          terms: {
            field: 'Organization.Name.untouched',
            size: 10,
            order: { sum: 'desc' },
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
        type: 'fieldValuesGroupStats',
        groupField: 'Organization.Name',
        statsField: 'LineItem.TotalPrice',
        sort: { field: 'max', direction: 'asc' },
      })
    ).toEqual({
      aggs: {
        groups: {
          terms: {
            field: 'Organization.Name',
            size: 10,
            order: { max: 'asc' },
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
        type: 'fieldValuesGroupStats',
        groupField: 'Organization.Name',
        sort: { field: 'count' },
      })
    ).toEqual({
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
        type: 'fieldValuesGroupStats',
        groupField: 'Organization.Name',
        sort: { field: 'key' },
      })
    ).toEqual({
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
        type: 'fieldValuesGroupStats',
        groupField: 'Organization.Name',
        statsField: 'LineItem.TotalPrice',
        filter: 'city',
        stats: ['sum'],
        size: 20,
      })
    ).toEqual({
      aggs: {
        valueFilter: {
          filter: {
            bool: {
              must: [
                {
                  regexp: {
                    'Organization.Name': {
                      value: '.*(city).*',
                      case_insensitive: true,
                    },
                  },
                },
              ],
            },
          },
          aggs: {
            groups: {
              terms: {
                field: 'Organization.Name',
                size: 20,
                order: { sum: 'desc' },
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
        type: 'fieldValuesGroupStats',
        groupField: 'Organization.Name',
        statsField: 'LineItem.TotalPrice',
        filter: 'city   of    ',
        stats: ['sum'],
      })
    ).toEqual({
      aggs: {
        valueFilter: {
          filter: {
            bool: {
              must: [
                {
                  regexp: {
                    'Organization.Name': {
                      value: '.*(city).*',
                      case_insensitive: true,
                    },
                  },
                },
                {
                  regexp: {
                    'Organization.Name': {
                      value: '.*(of).*',
                      case_insensitive: true,
                    },
                  },
                },
              ],
            },
          },
          aggs: {
            groups: {
              terms: {
                field: 'Organization.Name',
                size: 10,
                order: { sum: 'desc' },
              },
              aggs: { sum: { sum: { field: 'LineItem.TotalPrice' } } },
            },
          },
        },
      },
    })
  })

  describe('buildGroupQuery', () => {
    it('should return a query with a single terms group type if no additional fields are passed', () => {
      let node = { field: 'field1' }
      let children = {}
      let groupingType = 'Column'
      let schema = {
        fields: {
          field1: { elasticsearch: { notAnalyzedField: 'untouched' } },
        },
      }

      let expected = {
        aggs: {
          Column: {
            terms: {
              field: 'field1.untouched',
              size: 10,
            },
          },
        },
      }

      let result = buildGroupQuery(node, children, groupingType, schema)
      expect(expected).toEqual(result)
    })

    it('should return a query with a multi-terms group type if additional fields are passed', () => {
      let node = { field: 'field1', additionalFields: ['field2', 'field3'] }
      let children = {}
      let groupingType = 'Column'
      let schema = {
        fields: {
          field1: { elasticsearch: { notAnalyzedField: 'untouched' } },
          field2: { elasticsearch: { notAnalyzedField: 'raw' } },
          field3: { elasticsearch: { notAnalyzedField: 'untouched' } },
        },
      }

      let expected = {
        aggs: {
          Column: {
            multi_terms: {
              size: 10,
              terms: [
                {
                  field: 'field1.untouched',
                },
                {
                  field: 'field2.raw',
                },
                {
                  field: 'field3.untouched',
                },
              ],
            },
          },
        },
      }

      let result = buildGroupQuery(node, children, groupingType, schema)
      expect(expected).toEqual(result)
    })
  })
})
