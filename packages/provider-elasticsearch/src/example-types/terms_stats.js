var _ = require('lodash/fp')
var esTwoLevel = require('./esTwoLevelAggregation').result
let { buildRegexForWords } = require('../regex')
let { getField } = require('../fields')

module.exports = {
  validContext: context =>
    context.config.key_field && context.config.value_field,
  async result(context, search, schema) {
    let x = await esTwoLevel(
      _.merge(
        {
          config: {
            key_type: 'terms',
            key_data: _.extend(
              {
                field: getField(schema, context.key_field),
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
              context.config.filter && {
                include: buildRegexForWords(
                  context.config.caseSensitive, // false in all known instances
                  context.config.anyOrder // false in all known instances
                )(context.config.filter),
              }
            ),
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
