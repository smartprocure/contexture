import { buildQuery } from '../../../src/example-types/metricGroups/percentilesGroupStats.js'

describe('percentilesGroupStats', () => {
  it('should buildQuery', async () => {
    expect(
      await buildQuery(
        {
          key: 'test',
          type: 'percentilesGroupStats',
          groupField: 'LineItem.UnitPrice',
          percents: [20, 95],
        },
        null,
        () => ({
          percentiles: {
            '20.0': 30.549999237060547,
            '95.0': 39.20000076293945,
          },
        })
      )
    ).toEqual({
      aggs: {
        groups: {
          range: {
            field: 'LineItem.UnitPrice',
            ranges: [
              { to: 30.549999237060547 },
              { from: 30.549999237060547, to: 39.20000076293945 },
              { from: 39.20000076293945 },
            ],
          },
        },
      },
    })
  })
})
