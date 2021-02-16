module.exports = {
  // Filtering Only Types
  geo: require('./geo'),
  bool: require('./filters/bool'),
  date: require('./filters/date'),
  text: require('./text'),
  query: require('./query'),
  exists: require('./exists'),
  tagsText: require('./tagsText'),
  tagsQuery: require('./tagsQuery'),

  // Combo Filter + Results
  facet: require('./filters/facet'),
  number: require('./number'),
  dateRangeFacet: require('./filters/dateRangeFacet'),

  // Single Metrics
  results: require('./results'),
  cardinality: require('./cardinality'),
  percentiles: require('./percentiles'),
  statistical: require('./statistical'),
  stats: require('./metricGroups/stats'),
  valuesDelta: require('./metricGroups/valuesDelta'),

  // Metric Groups
  groupedByFieldValue: require('./metricGroups/groupedByFieldValue'),
  groupedByPercentiles: require('./metricGroups/groupedByPercentiles'),
  groupedByDateInterval: require('./metricGroups/groupedByDateInterval'),
  groupedByNumberRanges: require('./metricGroups/groupedByNumberRanges'),
  groupedByNumberInterval: require('./metricGroups/groupedByNumberInterval'),
  groupedByValuePartition: require('./metricGroups/groupedByValuePartition'),

  // Legacy (covered by metric groups)
  terms_stats: require('./legacy/terms_stats'),
  dateHistogram: require('./legacy/dateHistogram'),
  rangeStats: require('./legacy/rangeStats'),
  smartIntervalHistogram: require('./legacy/smartIntervalHistogram'),
  matchStats: require('./legacy/matchStats'),
  // Legacy (wip)
  groupedMetric: require('./groupedMetric'),
}
