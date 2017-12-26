var _ = require('lodash/fp')
var esTwoLevel = require('./esTwoLevelAggregation').result
let { buildRegexQueryForWords } = require('../regex')
let { getField } = require('../fields')

module.exports = {
  validContext: context =>
    context.config.key_field && context.config.value_field,
  async result(context, search, schema) {
    let field = getField(schema, context.config.key_field)
    let x = await esTwoLevel(
      _.merge(
        {
          config: {
            filter_agg: context.config.filter && buildRegexQueryForWords(field, context.config.caseSensitive)(context.config.filter),
            key_type: 'terms',
            key_data: {
              field,
              size: context.config.size || 10,
              order: {
                // Disable nested path checking for now as we don't need it anymore:
                //  key +
                //      may need >inner>inner. when adding additional inner for nested filters per old code
                //      xor paths - if both are nested or both not, the inner one wot be in inner
                //      ((!getNestedPath(context.config.value_field) != !getNestedPath(context.config.key_field)) ? '>inner.' : '.') +
                //  order
                [`twoLevelAgg.${context.config.order || 'sum'}`]:
                  context.config.sortDir || 'desc',
              },
            },
            value_type: 'stats',
          },
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
