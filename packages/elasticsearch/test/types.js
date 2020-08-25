let _ = require('lodash/fp')
let Types = require('../src/types')
let { expect } = require('chai')

describe('All Example Types', function() {
  this.timeout(5000)
  it('should load', () => {
    let types = Types()
    expect(_.sortBy(x => x, _.keys(types))).to.have.members([
      'bool',
      'cardinality',
      'date',
      'dateHistogram',
      'dateRangeFacet',
      'default',
      'exists',
      'facet',
      'geo',
      'groupedMetric',
      'groupedByDateInterval',
      'groupedByFieldValue',
      'groupedByNumberInterval',
      'groupedByNumberRanges',
      'groupedByValuePartition',
      'matchCardinality',
      'matchStats',
      'number',
      'numberRangeHistogram',
      'percentiles',
      'percentilesRange',
      'query',
      'rangeStats',
      'results',
      'smartIntervalHistogram',
      'statistical',
      'tagsQuery',
      'tagsText',
      'termsStatsHits',
      'terms_stats',
      'text',
      'valuesDelta',
    ])
  })
})
