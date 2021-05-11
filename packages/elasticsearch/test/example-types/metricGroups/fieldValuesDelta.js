let {
  buildQuery,
  result,
} = require('../../../src/example-types/metricGroups/fieldValuesDelta')
let { expect } = require('chai')
let { testSchema } = require('../testUtils')

describe('fieldValuesDelta', () => {
  let exampleNode = {
    key: 'test',
    type: 'fieldValuesDelta',
    groupField: 'Organization.State',
    size: 50000,
    background: {
      type: 'range',
      field: 'PO.IssuedDate',
      gte: 'now-2y-180d',
      lte: 'now-180d',
      format: 'date_optional_time',
    },
    foreground: {
      type: 'range',
      field: 'PO.IssuedDate',
      gte: 'now-180d',
      lte: 'now',
      format: 'date_optional_time',
    },
  }
  it('should buildQuery', () => {
    expect(buildQuery(exampleNode, testSchema('Organization.State'))).to.eql({
      aggs: {
        results: {
          filters: {
            filters: {
              background: {
                range: {
                  'PO.IssuedDate': {
                    gte: 'now-2y-180d',
                    lte: 'now-180d',
                    format: 'date_optional_time',
                  },
                },
              },
              foreground: {
                range: {
                  'PO.IssuedDate': {
                    gte: 'now-180d',
                    lte: 'now',
                    format: 'date_optional_time',
                  },
                },
              },
            },
          },
          aggs: {
            field: {
              terms: { field: 'Organization.State.untouched', size: 50000 },
            },
          },
        },
      },
    })
  })
  it('should process results', async () => {
    let search = () => ({
      aggregations: {
        results: {
          buckets: {
            background: {
              doc_count: 713621,
              field: {
                doc_count_error_upper_bound: 196,
                sum_other_doc_count: 358615,
                buckets: [
                  { key: 'tx', doc_count: 200165 },
                  { key: 'ca', doc_count: 62785 },
                  { key: 'il', doc_count: 33922 },
                  { key: 'fl', doc_count: 32806 },
                  { key: 'wi', doc_count: 25328 },
                ],
              },
            },
            foreground: {
              doc_count: 4466,
              field: {
                doc_count_error_upper_bound: 0,
                sum_other_doc_count: 2615,
                buckets: [
                  { key: 'tx', doc_count: 700 },
                  { key: 'ca', doc_count: 414 },
                  { key: 'mo', doc_count: 266 },
                  { key: 'fl', doc_count: 242 },
                  { key: 'oh', doc_count: 229 },
                ],
              },
            },
          },
        },
      },
    })
    expect(await result(exampleNode, search)).to.eql({ results: ['mo', 'oh'] })
  })
})
