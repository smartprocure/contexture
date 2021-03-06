let {
  buildQuery,
  result,
} = require('../../../src/example-types/metricGroups/stats')
let { expect } = require('chai')

describe('stats', () => {
  it('should buildQuery', () => {
    expect(
      buildQuery({
        key: 'test',
        type: 'stats',
        statsField: 'PO.IssuedAmount',
        stats: ['min', 'max'],
      })
    ).to.eql({
      aggs: {
        min: { min: { field: 'PO.IssuedAmount' } },
        max: { max: { field: 'PO.IssuedAmount' } },
      },
    })
  })
  it('should buildQuery', () => {
    expect(
      buildQuery({
        key: 'test',
        type: 'stats',
        statsField: 'PO.IssuedAmount',
        stats: {
          min: true,
          max: true,
          percentiles: { percents: [20, 50] },
          topHits: true,
          cardinality: true,
        },
      })
    ).to.eql({
      aggs: {
        min: { min: { field: 'PO.IssuedAmount' } },
        max: { max: { field: 'PO.IssuedAmount' } },
        cardinality: { cardinality: { field: 'PO.IssuedAmount' } },
        percentiles: {
          percentiles: { field: 'PO.IssuedAmount', percents: [20, 50] },
        },
        topHits: { top_hits: {} },
      },
    })
  })
  it('should process results', async () => {
    let search = () => ({
      aggregations: {
        percentiles: {
          values: {
            '20.0': 280.6375270684573,
            '50.0': 1341.541076270763,
          },
        },
        min: {
          value: -2669666.5,
        },
        max: {
          value: 1.00395288e8,
        },
        cardinality: {
          value: 471,
        },
        topHits: {
          hits: {
            total: 1260294,
            max_score: 1.0,
            hits: [
              {
                _index: 'sp-data-20200814-lit',
                _type: 'line-item-type',
                _id: '75223_57328_1',
                _score: 1.0,
                _source: {
                  Description: 'iPad 2 Charging Cable',
                  Quantity: 80,
                  TotalPrice: 559.2,
                  UnitPrice: 6.99,
                },
              },
              {
                _index: 'sp-data-20200814-lit',
                _type: 'line-item-type',
                _id:
                  '74013_Date|Vendor-11_16_2015|Revolution_Electronic_Repair__LLC_3',
                _score: 1.0,
                _source: {
                  Description:
                    'IPAD Repairs - Bad Display Repair - DMRHRQTVDJ8T',
                  Quantity: 1,
                  TotalPrice: 75,
                  UnitPrice: 75,
                },
              },
              {
                _index: 'sp-data-20200814-lit',
                _type: 'line-item-type',
                _id:
                  '74013_Date|Vendor-11_16_2015|Revolution_Electronic_Repair__LLC_10',
                _score: 1.0,
                _source: {
                  ID:
                    '74013_Date|Vendor-11_16_2015|Revolution_Electronic_Repair__LLC_10',
                  Description:
                    'IPAD Repairs - Cracked Glass Repair - DKVM20CMDJ8T',
                  Quantity: 1,
                  TotalPrice: 85,
                  UnitPrice: 85,
                },
              },
            ],
          },
        },
      },
    })
    expect(await result({}, search)).to.eql({
      percentiles: {
        '20.0': 280.6375270684573,
        '50.0': 1341.541076270763,
      },
      min: -2669666.5,
      max: 1.00395288e8,
      cardinality: 471,
      topHits: {
        total: 1260294,
        max_score: 1.0,
        hits: [
          {
            _index: 'sp-data-20200814-lit',
            _type: 'line-item-type',
            _id: '75223_57328_1',
            _score: 1.0,
            _source: {
              Description: 'iPad 2 Charging Cable',
              Quantity: 80,
              TotalPrice: 559.2,
              UnitPrice: 6.99,
            },
          },
          {
            _index: 'sp-data-20200814-lit',
            _type: 'line-item-type',
            _id:
              '74013_Date|Vendor-11_16_2015|Revolution_Electronic_Repair__LLC_3',
            _score: 1.0,
            _source: {
              Description: 'IPAD Repairs - Bad Display Repair - DMRHRQTVDJ8T',
              Quantity: 1,
              TotalPrice: 75,
              UnitPrice: 75,
            },
          },
          {
            _index: 'sp-data-20200814-lit',
            _type: 'line-item-type',
            _id:
              '74013_Date|Vendor-11_16_2015|Revolution_Electronic_Repair__LLC_10',
            _score: 1.0,
            _source: {
              ID:
                '74013_Date|Vendor-11_16_2015|Revolution_Electronic_Repair__LLC_10',
              Description: 'IPAD Repairs - Cracked Glass Repair - DKVM20CMDJ8T',
              Quantity: 1,
              TotalPrice: 85,
              UnitPrice: 85,
            },
          },
        ],
      },
    })
  })
})
