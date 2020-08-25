module.exports = {
  default: require('./default'),

  // Filtering Only Types
  geo: require('./geo'),
  bool: require('./bool'),
  date: require('./date'),
  text: require('./text'),
  query: require('./query'),
  exists: require('./exists'),
  tagsText: require('./tagsText'),
  tagsQuery: require('./tagsQuery'),

  // Combo Filter + Results
  facet: require('./facet'),
  number: require('./number'),
  dateRangeFacet: require('./dateRangeFacet'),

  // Single Metrics
  results: require('./results'),
  cardinality: require('./cardinality'),
  percentiles: require('./percentiles'),
  statistical: require('./statistical'),
  valuesDelta: require('./metricGroups/valuesDelta'),

  // Metric Groups
  groupedByFieldValue: require('./metricGroups/groupedByFieldValue'),
  groupedByDateInterval: require('./metricGroups/groupedByDateInterval'),
  groupedByNumberRanges: require('./metricGroups/groupedByNumberRanges'),
  groupedByNumberInterval: require('./metricGroups/groupedByNumberInterval'),
  groupedByPercentiles: require('./metricGroups/groupedByPercentiles'),
  groupedByValuePartition: require('./metricGroups/groupedByValuePartition'),

  // Legacy (covered by metric groups)
  terms_stats: require('./terms_stats'),
  dateHistogram: require('./dateHistogram'),
  rangeStats: require('./rangeStats'),
  smartIntervalHistogram: require('./smartIntervalHistogram'),
  matchStats: require('./matchStats'),
  matchCardinality: require('./matchCardinality'),
  // Legacy (wip)
  groupedMetric: require('./groupedMetric'),
  numberRangeHistogram: require('./numberRangeHistogram'),
  termsStatsHits: require('./termsStatsHits'),
}
