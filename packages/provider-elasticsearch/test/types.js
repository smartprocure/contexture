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
      'exists',
      'facet',
      'geo',
      'dateIntervalGroupStats',
      'fieldValueGroupStats',
      'numberIntervalGroupStats',
      'numberRangesGroupStats',
      'percentilesGroupStats',
      'groupedByValuePartition',
      'groupedMetric',
      'matchStats',
      'number',
      'percentiles',
      'query',
      'rangeStats',
      'results',
      'smartIntervalHistogram',
      'statistical',
      'stats',
      'tagsQuery',
      'tagsText',
      'terms_stats',
      'text',
      'valuesDelta',
    ])
  })
})
