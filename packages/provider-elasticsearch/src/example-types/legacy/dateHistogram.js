import esTwoLevel from './esTwoLevelAggregation.js'

export default {
  validContext: (node) => node.key_field && node.value_field,
  result: ({ key_field, value_field, interval = 'year' }, search) =>
    esTwoLevel
      .result(
        {
          key_type: 'date_histogram',
          key_field,
          key_data: { calendar_interval: interval, min_doc_count: 0 },
          value_field,
          value_type: 'stats',
        },
        search
      )
      .then((x) => ({ entries: x.results })),
}
