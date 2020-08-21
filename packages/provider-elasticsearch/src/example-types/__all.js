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

  // Legacy (covered by metric groups)
  esTwoLevelAggregation: require('./esTwoLevelAggregation'),
  terms_stats: require('./terms_stats'),
  dateHistogram: require('./dateHistogram'),
  rangeStats: require('./rangeStats'),
  smartIntervalHistogram: require('./smartIntervalHistogram'),
  twoLevelMatch: require('./twoLevelMatch'),
  matchStats: require('./matchStats'),
  matchCardinality: require('./matchCardinality'),
  // Legacy (wip)
  groupedMetric: require('./groupedMetric'),
  percentilesRange: require('./percentilesRange'),
  numberRangeHistogram: require('./numberRangeHistogram'),
  termsDelta: require('./termsDelta'),
  termsStatsHits: require('./termsStatsHits'),
}
