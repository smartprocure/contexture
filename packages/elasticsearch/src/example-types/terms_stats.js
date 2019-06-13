var _ = require('lodash/fp')
let F = require('futil-js')
var esTwoLevel = require('./esTwoLevelAggregation').result
let { buildRegexQueryForWords } = require('../regex')
let { getField } = require('../fields')
let { metrics, hasValidMetrics } = require('../aggUtils')

module.exports = {
  validContext: context => context.key_field && context.value_field,
  async result(context, search, schema) {
    let field = getField(schema, context.key_field, context.fieldMode)
    let orderPaths = F.arrayToObject(
      _.identity,
      metric => ({
        [metric === 'stats'
          ? `twoLevelAgg.${context.order || 'sum'}`
          : `twoLevelAgg_${metric}.value`]: context.sortDir || 'desc',
      }),
      metrics
    )
    let x = await esTwoLevel(
      _.merge(
        {
          filter_agg:
            context.filter &&
            buildRegexQueryForWords(field, context.caseSensitive)(
              context.filter
            ),
          key_type: 'terms',
          key_data: {
            field,
            size: context.size || 10,
            order:
              hasValidMetrics(context) && _.size(context.include)
                ? orderPaths[
                    _.contains('stats', context.include)
                      ? 'stats'
                      : context.order
                  ]
                : orderPaths['stats'],
          },
          value_type: 'stats',
        },
        context
      ),
      search
    )
    return {
      terms: x.results,
    }
  },
}
