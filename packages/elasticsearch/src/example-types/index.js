module.exports = {
  // Filtering Only Types
  geo: require('./filters/geo'),
  bool: require('./filters/bool'),
  date: require('./filters/date'),
  text: require('./filters/text'),
  query: require('./filters/query'),
  exists: require('./filters/exists'),
  tagsText: require('./filters/tagsText'),
  tagsQuery: require('./filters/tagsQuery'),

  // Combo Filter + Results
  facet: require('./filters/facet'),
  number: require('./filters/number'),
  dateRangeFacet: require('./filters/dateRangeFacet'),

  // Single Metrics
  results: require('./results'),
  stats: require('./metricGroups/stats'),
  valuesDelta: require('./metricGroups/valuesDelta'),

  // Metric Groups
  groupedByFieldValue: require('./metricGroups/groupedByFieldValue'),
  groupedByPercentiles: require('./metricGroups/groupedByPercentiles'),
  dateIntervalGroupStats: require('./metricGroups/dateIntervalGroupStats'),
  groupedByNumberRanges: require('./metricGroups/groupedByNumberRanges'),
  groupedByNumberInterval: require('./metricGroups/groupedByNumberInterval'),
  groupedByValuePartition: require('./metricGroups/groupedByValuePartition'),

  // Legacy (covered by metric groups)
  statistical: require('./legacy/statistical'),
  cardinality: require('./legacy/cardinality'),
  percentiles: require('./legacy/percentiles'),
  terms_stats: require('./legacy/terms_stats'),
  dateHistogram: require('./legacy/dateHistogram'),
  rangeStats: require('./legacy/rangeStats'),
  smartIntervalHistogram: require('./legacy/smartIntervalHistogram'),
  matchStats: require('./legacy/matchStats'),
  // Legacy (wip)
  groupedMetric: require('./groupedMetric'),
}
