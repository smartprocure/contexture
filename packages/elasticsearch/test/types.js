let _ = require('lodash/fp')
let Types = require('../src/types')
let { expect } = require('chai')

describe('All Example Types', function() {
  this.timeout(5000)
  it('should load', () => {
    let types = Types()
    expect(_.keys(types)).to.have.members([
      '__all',
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
      'numberRangeHistogram',
      'numberUtil',
      'percentileRanks',
      'percentiles',
      'percentilesRange',
      'query',
      'rangeStats',
      'results',
      'smartIntervalHistogram',
      'smartPercentileRanks',
      'statistical',
      'tagsQuery',
      'terms',
      'termsDelta',
      'termsStatsHits',
      'terms_stats',
      'text',
      'twoLevelMatch',
    ])
  })
})
