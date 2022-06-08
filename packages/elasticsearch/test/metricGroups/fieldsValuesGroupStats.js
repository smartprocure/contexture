let {
  buildGroupQuery,
} = require('../../src/example-types/metricGroups/fieldValuesGroupStats')
let { expect } = require('chai')

describe('buildGroupQuery', () => {
  it('should return a query with a single terms group type if no additional fields are passed', () => {
    let node = { field: 'field1' }
    let children = {}
    let groupingType = 'Column'
    let schema = {
      fields: { field1: { elasticsearch: { notAnalyzedField: 'untouched' } } },
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
    expect(expected).to.eql(result)
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
            terms: [
              {
                field: 'field1.untouched',
                size: 10,
              },
              {
                field: 'field2.raw',
                size: 10,
              },
              {
                field: 'field3.untouched',
                size: 10,
              },
            ],
          },
        },
      },
    }

    let result = buildGroupQuery(node, children, groupingType, schema)
    expect(expected).to.eql(result)
  })
})
