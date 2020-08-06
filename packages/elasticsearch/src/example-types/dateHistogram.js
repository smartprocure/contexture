let _ = require('lodash/fp')
let F = require('futil')
let moment = require('moment')
let dateMath = require('@elastic/datemath')
let esTwoLevel = require('./esTwoLevelAggregation').result

module.exports = {
  validContext: node => node.key_field && node.value_field,
  result(node, search) {
    let payload = {
      key_type: 'date_histogram',
      key_data: {
        interval: node.interval || 'year',
        min_doc_count: 0,
      },
      value_type: 'stats',
      extraAggs: [
        {
          key: 'max_date',
          config: {
            value_field: 'value',
            data: {
              max: {
                field: node.key_field,
              },
            },
          },
        },
        {
          key: 'min_date',
          config: {
            value_field: 'value',
            data: {
              min: {
                field: node.key_field,
              },
            },
          },
        },
      ],
    }

    if (node.boundsRange_min && node.boundsRange_max) {
      let useDateMath = node.boundsRange_useDateMath
      let min = node.boundsRange_min
      let max = node.boundsRange_max
      F.extendOn(payload.key_data, {
        extended_bounds: {
          min: useDateMath
            ? dateMath.parse(min)
            : moment(new Date(min)).format('YYYY-MM-DD'),
          max: useDateMath
            ? dateMath.parse(max)
            : moment(new Date(max)).format('YYYY-MM-DD'),
        },
      })
    }

    return esTwoLevel(_.merge(payload, node), search).then(x => ({
      entries: x.results,
      minDate: x.min_date,
      maxDate: x.max_date,
    }))
  },
}
