var _ = require('lodash/fp')
var esTwoLevel = require('./esTwoLevelAggregation').result

module.exports = {
  validContext: context =>
    context.config.key_field && context.config.value_field,
  result(context, search) {
    var filter = null

    if (context.config.filter) {
      var filterParts = context.config.filter
        .trim()
        .replace(/\s\s+/g, ' ')
        .toLowerCase()
        .split(' ')
      var rawFieldName = (
        _.get('name', context.config.key_field) || context.config.key_field
      ).replace('.untouched', '.lowercased')
      filter = {
        bool: {
          must: _.map(
            f => ({
              wildcard: {
                [rawFieldName]: `*${f.replace(/\*|-|\+/g, '')}*`,
              },
            }),
            filterParts
          ),
        },
      }
    }

    return esTwoLevel(
      _.merge(
        {
          config: {
            filter_agg: filter,
            key_type: 'terms',
            key_data: {
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
    ).then(x => ({
      terms: x.results,
    }))
  },
}
