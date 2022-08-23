let {
  statsAggs,
  buildMetrics,
  simplifyBucket,
  simplifyBuckets,
  basicSimplifyTree,
} = require('../../src/utils/elasticDSL')
let { expect } = require('chai')

describe('elasticDSL utils', () => {
  describe('buildMetrics', () => {
    it('should work', () => {
      expect(buildMetrics('price')).to.eql({
        min: { min: { field: 'price' } },
        max: { max: { field: 'price' } },
        avg: { avg: { field: 'price' } },
        sum: { sum: { field: 'price' } },
      })
    })
    it('should work with explicit stats', () => {
      expect(buildMetrics('price', ['max', 'sum', 'cardinality'])).to.eql({
        max: { max: { field: 'price' } },
        sum: { sum: { field: 'price' } },
        cardinality: { cardinality: { field: 'price' } },
      })
    })
  })
  describe('statsAggs', () => {
    it('should work', () => {
      expect(statsAggs('price')).to.eql({
        aggs: {
          min: { min: { field: 'price' } },
          max: { max: { field: 'price' } },
          avg: { avg: { field: 'price' } },
          sum: { sum: { field: 'price' } },
        },
      })
    })
    it('should work with explicit stats', () => {
      expect(statsAggs('price', ['max', 'sum', 'cardinality'])).to.eql({
        aggs: {
          max: { max: { field: 'price' } },
          sum: { sum: { field: 'price' } },
          cardinality: { cardinality: { field: 'price' } },
        },
      })
    })
    it('should add no stats without field', () => {
      expect(statsAggs(null, ['max', 'sum', 'cardinality'])).to.eql({})
      expect(statsAggs()).to.eql({})
    })
    it('should work with top hits in array', () => {
      expect(statsAggs('price', ['min', 'topHits'])).to.eql({
        aggs: {
          min: { min: { field: 'price' } },
          topHits: { top_hits: {} },
        },
      })
    })
    it('should work with objects', () => {
      expect(
        statsAggs('price', { min: true, percentiles: { percents: [20, 50] } })
      ).to.eql({
        aggs: {
          min: { min: { field: 'price' } },
          percentiles: { percentiles: { field: 'price', percents: [20, 50] } },
        },
      })
    })
    it('should work with top hits', () => {
      expect(
        statsAggs('price', {
          min: true,
          topHits: { field: null, order: {}, _source: { include: ['city'] } },
        })
      ).to.eql({
        aggs: {
          min: { min: { field: 'price' } },
          topHits: { top_hits: { order: {}, _source: { include: ['city'] } } },
        },
      })
    })
    it('might even work with buckets', () => {
      expect(
        statsAggs('price', {
          min: true,
          histogram: { interval: 10000 },
        })
      ).to.eql({
        aggs: {
          min: { min: { field: 'price' } },
          histogram: { histogram: { field: 'price', interval: 10000 } },
        },
      })
    })
  })
  describe('simplifyBuckets', () => {
    it('should work', () => {
      expect(
        simplifyBuckets([
          { key: 'test', doc_count: 12, min: { value: 1 }, max: { value: 6 } },
          { key: 'testy', doc_count: 12, min: { value: 1 }, max: { value: 6 } },
        ])
      ).to.eql([
        { key: 'test', count: 12, min: 1, max: 6 },
        { key: 'testy', count: 12, min: 1, max: 6 },
      ])
    })
    it('should work for match object', () => {
      expect(
        simplifyBuckets({
          pass: { doc_count: 12, min: { value: 1 }, max: { value: 6 } },
          fail: { doc_count: 12, min: { value: 1 }, max: { value: 6 } },
        })
      ).to.eql([
        { key: 'pass', count: 12, min: 1, max: 6 },
        { key: 'fail', count: 12, min: 1, max: 6 },
      ])
    })
    it('should work for range stats', () => {
      expect(
        simplifyBuckets([
          {
            key: '0.0-500.0',
            from: 0,
            from_as_string: '0.0',
            to: 500,
            to_as_string: '500.0',
            doc_count: 476899106,
            min: { value: -500000000 },
            max: { value: 937998784 },
            avg: { value: 973.7296742278231 },
            sum: { value: 464370811124.9201 },
          },
          {
            key: '500.0-10000.0',
            from: 500,
            from_as_string: '500.0',
            to: 10000,
            to_as_string: '10000.0',
            doc_count: 110489302,
            min: { value: -999299968 },
            max: { value: 2100000000 },
            avg: { value: 3038.799582495458 },
            sum: { value: 335754844787.8146 },
          },
        ])
      ).to.eql([
        {
          key: '0.0-500.0',
          from: 0,
          fromAsString: '0.0',
          to: 500,
          toAsString: '500.0',
          count: 476899106,
          min: -500000000,
          max: 937998784,
          avg: 973.7296742278231,
          sum: 464370811124.9201,
        },
        {
          key: '500.0-10000.0',
          from: 500,
          fromAsString: '500.0',
          to: 10000,
          toAsString: '10000.0',
          count: 110489302,
          min: -999299968,
          max: 2100000000,
          avg: 3038.799582495458,
          sum: 335754844787.8146,
        },
      ])
    })
  })
  describe('simplifyBucket', () => {
    it('should work on value (cardinality example)', () => {
      let input = { cardinality: { value: 471 } }
      let expected = { cardinality: 471 }
      expect(simplifyBucket(input)).to.eql(expected)
    })
    it('should work on values (percentiles example)', () => {
      expect(
        simplifyBucket({
          percentiles: {
            keyed: true,
            values: [
              { key: 10.0, value: 44 },
              { key: 30.0, value: 63 },
              { key: 70.0, value: 80.5 },
            ],
          },
        })
      ).to.eql({
        percentiles: [
          { key: 10.0, value: 44 },
          { key: 30.0, value: 63 },
          { key: 70.0, value: 80.5 },
        ],
      })
    })
    it('should work on cases where value is 0', () => {
      expect(simplifyBucket({ min: { value: 0 }, max: { value: 0 } })).to.eql({
        min: 0,
        max: 0,
      })
    })
    it('should work on cases where value is null', () => {
      expect(
        simplifyBucket({ min: { value: null }, max: { value: null } })
      ).to.eql({ min: null, max: null })
    })
    it('should avoid camelCasing pivotMetrics', () => {
      expect(
        simplifyBucket({ 'pivotMetric-min-PO.IssuedDate': { value: 12 } })
      ).to.eql({ 'min-PO.IssuedDate': 12 })
    })
  })
  describe('basicSimplifyTree', () => {
    it('Extremely simple tree simplification', () => {
      let tree = {
        valueFilter: {
          key: 'root',
          groups: {
            buckets: [
              {
                key: 'row1',
                groups: { buckets: [{ key: 'thing' }, { key: 'thing2' }] },
                columns: {
                  buckets: [
                    {
                      key: 'innermost',
                      columns: {
                        buckets: [
                          {
                            key: 'colbucket',
                            valueFilter: {
                              columns: { buckets: [{ key: 'specialInner' }] },
                            },
                          },
                        ],
                      },
                    },
                    {
                      key: 'inner2',
                      min: { value: 12 },
                      some_value: 3,
                      'pivotMetric-min-PO.IssuedDate': { value: 12 },
                    },
                  ],
                },
              },
            ],
          },
          columns: {
            buckets: [
              {
                key: 'innermostC',
                columns: {
                  buckets: [
                    {
                      key: 'colbucket',
                      valueFilter: {
                        columns: { buckets: [{ key: 'specialInner' }] },
                      },
                    },
                  ],
                },
              },
              {
                key: 'inner2C',
                min: { value: 12 },
                some_value: 3,
                'pivotMetric-min-PO.IssuedDate': { value: 12 },
              },
            ],
          },
        },
      }
      expect(basicSimplifyTree(tree)).to.deep.equal({
        key: 'root',
        groups: [
          {
            key: 'row1',
            groups: [{ key: 'thing' }, { key: 'thing2' }],
            columns: [
              {
                key: 'innermost',
                columns: [
                  { key: 'colbucket', columns: [{ key: 'specialInner' }] },
                ],
              },
              { key: 'inner2', min: 12, someValue: 3, 'min-PO.IssuedDate': 12 },
            ],
          },
        ],
        columns: [
          {
            key: 'innermostC',
            columns: [{ key: 'colbucket', columns: [{ key: 'specialInner' }] }],
          },
          { key: 'inner2C', min: 12, someValue: 3, 'min-PO.IssuedDate': 12 },
        ],
      })
    })
    it('should return what we want', () => {
      let tree = {
        results: {
          columns: [
            {
              keyAsString: '2015-01-01T00:00:00.000Z',
              key: 1420070400000,
              count: 149899462,
              'sum-LineItem.TotalPrice': 1217970954399.7263,
            },
            {
              keyAsString: '2016-01-01T00:00:00.000Z',
              key: 1451606400000,
              count: 157148228,
              'sum-LineItem.TotalPrice': 1408804510809.2117,
            },
          ],
          rows: {
            texas: {
              count: 102059166,
              metric: 496115788610.9865,
              columns: [
                {
                  keyAsString: '2015-01-01T00:00:00.000Z',
                  key: 1420070400000,
                  count: 13792834,
                  'sum-LineItem.TotalPrice': 41095252731.51122,
                },
                {
                  keyAsString: '2016-01-01T00:00:00.000Z',
                  key: 1451606400000,
                  count: 14099014,
                  'sum-LineItem.TotalPrice': 54416178152.06644,
                },
              ],
              'sum-LineItem.TotalPrice': 496115788610.9865,
            },
            utah: {
              count: 22791481,
              metric: 79524119321.59206,
              columns: [
                {
                  keyAsString: '2015-01-01T00:00:00.000Z',
                  key: 1420070400000,
                  count: 2972357,
                  'sum-LineItem.TotalPrice': 10773624509.026503,
                },
                {
                  keyAsString: '2016-01-01T00:00:00.000Z',
                  key: 1451606400000,
                  count: 3696754,
                  'sum-LineItem.TotalPrice': 14220850666.835142,
                },
              ],
              'sum-LineItem.TotalPrice': 79524119321.59206,
            },
          },
          'sum-LineItem.TotalPrice': 11333822932797.13,
        },
      }
      expect(basicSimplifyTree(tree)).to.deep.equal({
        results: {
          columns: [
            {
              keyAsString: '2015-01-01T00:00:00.000Z',
              key: 1420070400000,
              count: 149899462,
              'sum-LineItem.TotalPrice': 1217970954399.7263,
            },
            {
              keyAsString: '2016-01-01T00:00:00.000Z',
              key: 1451606400000,
              count: 157148228,
              'sum-LineItem.TotalPrice': 1408804510809.2117,
            },
          ],
          rows: [
            {
              key: 'texas',
              count: 102059166,
              metric: 496115788610.9865,
              columns: [
                {
                  keyAsString: '2015-01-01T00:00:00.000Z',
                  key: 1420070400000,
                  count: 13792834,
                  'sum-LineItem.TotalPrice': 41095252731.51122,
                },
                {
                  keyAsString: '2016-01-01T00:00:00.000Z',
                  key: 1451606400000,
                  count: 14099014,
                  'sum-LineItem.TotalPrice': 54416178152.06644,
                },
              ],
              'sum-LineItem.TotalPrice': 496115788610.9865,
            },
            {
              key: 'utah',
              count: 22791481,
              metric: 79524119321.59206,
              columns: [
                {
                  keyAsString: '2015-01-01T00:00:00.000Z',
                  key: 1420070400000,
                  count: 2972357,
                  'sum-LineItem.TotalPrice': 10773624509.026503,
                },
                {
                  keyAsString: '2016-01-01T00:00:00.000Z',
                  key: 1451606400000,
                  count: 3696754,
                  'sum-LineItem.TotalPrice': 14220850666.835142,
                },
              ],
              'sum-LineItem.TotalPrice': 79524119321.59206,
            },
          ],
          'sum-LineItem.TotalPrice': 11333822932797.13,
        },
      })
    })
  })
})
