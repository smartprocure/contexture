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
          [`twoLevelAgg_${metric}.value`]: context.sortDir || 'desc',
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
            order: hasValidMetrics(context)
              ? orderPaths[context.order]
              : {
                  // Disable nested path checking for now as we don't need it anymore:
                  //  key +
                  //      may need >inner>inner. when adding additional inner for nested filters per old code
                  //      xor paths - if both are nested or both not, the inner one wot be in inner
                  //      ((!getNestedPath(context.value_field) != !getNestedPath(context.key_field)) ? '>inner.' : '.') +
                  //  order
                  [`twoLevelAgg.${context.order || 'sum'}`]:
                    context.sortDir || 'desc',
                },
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
