let {
  buildQuery,
} = require('../../../src/example-types/metricGroups/groupedByPercentiles')
let { expect } = require('chai')

describe('groupedByPercentiles', () => {
  it('should buildQuery', async () => {
    expect(
      await buildQuery(
        {
          key: 'test',
          type: 'groupedByPercentiles',
          groupField: 'LineItem.UnitPrice',
          percents: [20, 95],
        },
        field => ({percentiles: {
          keyed: false,
          values: [
            {
              key: 20,
              value: 30.549999237060547,
            },
            {
              key: 95,
              value: 39.20000076293945,
            },
          ],
        }})
      )
    ).to.eql({
      aggs: {
        groups: {
          range: {
            field: 'LineItem.UnitPrice',
            ranges: [
              {
                to: 30.549999237060547,
              },
              {
                from: 30.549999237060547,
                to: 39.20000076293945,
              },
              {
                from: 39.20000076293945,
              },
            ],
          },
        },
      },
    },)
  })
})
