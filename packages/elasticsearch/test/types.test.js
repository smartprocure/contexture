import _ from 'lodash/fp.js'
import Types from '../src/types.js'

describe('All Example Types', () => {
  it('should load', () => {
    let types = Types()
    expect(_.sortBy(x => x, _.keys(types))).toEqual([
      'bool',
      'cardinality',
      'date',
      'dateHistogram',
      'dateIntervalGroupStats',
      'dateRangeFacet',
      'dateRangesGroupStats',
      'exists',
      'facet',
      'fieldValuePartitionGroupStats',
      'fieldValuesDelta',
      'fieldValuesGroupStats',
      'geo',
      'matchStats',
      'number',
      'numberIntervalGroupStats',
      'numberRangesGroupStats',
      'percentilesGroupStats',
      'pivot',
      'query',
      'rangeStats',
      'results',
      'smartIntervalHistogram',
      'statistical',
      'stats',
      'tagsQuery',
      'tagsQueryGroupStats',
      'tagsText',
      'terms_stats',
      'text',
    ])
  }, 5000)
})
