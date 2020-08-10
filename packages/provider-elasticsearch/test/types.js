let _ = require('lodash/fp')
let Types = require('../src/types')
let { expect } = require('chai')

describe('All Example Types', function() {
  this.timeout(5000)
  it('should load', () => {
    let types = Types()
    expect(_.keys(types)).to.have.members([
      'bool',
      'cardinality',
      'date',
      'dateHistogram',
      'dateRangeFacet',
      'default',
      'esTwoLevelAggregation',
      'exists',
      'facet',
      'geo',
      'groupedMetric',
      'matchCardinality',
      'matchStats',
      'number',
      'numberRangeHistogram',
      'numberUtil',
      'percentiles',
      'percentilesRange',
      'query',
      'rangeStats',
      'results',
      'smartIntervalHistogram',
      'statistical',
      'tagsQuery',
      'tagsText',
      'terms',
      'termsDelta',
      'termsStatsHits',
      'terms_stats',
      'text',
      'twoLevelMatch',
    ])
  })
})
