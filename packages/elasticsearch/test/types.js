let _ = require('lodash/fp')
let Types = require('../src/types')
let { expect } = require('chai')

describe('All Example Types', () => {
  it('should load', () => {
    let types = Types()
    expect(_.keys(types)).to.deep.equal([
      'bool',
      'cardinality',
      'date',
      'dateHistogram',
      'default',
      'esTwoLevelAggregation',
      'exists',
      'facet',
      'geo',
      'groupedMetric',
      'matchCardinality',
      'matchStats',
      'nLevelAggregation',
      'nonzeroClusters',
      'number',
      'percentileRanks',
      'percentiles',
      'percentilesRange',
      'query',
      'rangeStats',
      'results',
      'smartIntervalHistogram',
      'smartPercentileRanks',
      'statistical',
      'terms',
      'termsDelta',
      'termsStatsHits',
      'terms_stats',
      'text',
      'twoLevelMatch',
    ])
  })
})
