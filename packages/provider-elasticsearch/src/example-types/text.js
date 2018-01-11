let _ = require('lodash/fp')
let unidecode = require('unidecode')
let { toSafeRegex } = require('../regex')

module.exports = {
  hasValue: context =>
    context.value || _.get('values.length', context),
  filter(context) {
    let fieldName = context.field.replace('.untouched', '')
    let filterParts =
      context.values || context.value.toLowerCase().split(' ')

    let lookAtUntouched = /startsWith|endsWith|is|isNot|containsWord/.test(
      context.operator
    )

    let useQueryString =
      /\b(contains|containsExact)\b/.test(context.operator) ||
      (context.operator === 'containsWord' && filterParts.length > 2)

    if (useQueryString) {
      let result = {
        query_string: {
          query: _.map(x => `"${x}"`, filterParts).join(' '),
          default_field: fieldName,
          default_operator: context.join === 'any' ? 'OR' : 'AND',
        },
      }
      if (context.operator === 'containsExact')
        result.query_string.analyzer = 'exact'
      if (context.join === 'none') {
        result = {
          bool: {
            must_not: result,
          },
        }
      }
      return result
    }

    if (lookAtUntouched) fieldName += '.untouched'

    if (
      /endsWith|wordEndsWith/.test(context.operator) &&
      filterParts.length > 2
    )
      throw new Error("You can't have more than 2 ends with filters")

    let join = {
      all: 'must',
      any: 'should',
      none: 'must_not',
    }[context.join || 'all']

    let filter = {
      bool: {
        [join]: _.map(f => {
          let criteria = f
            .toLowerCase()
            .replace('*', '')
            .replace('+', '')
            .replace('-', '')
          if (lookAtUntouched)
            criteria = (context.value || f).toLowerCase()

          let prefix = /startsWith|wordStartsWith|is|isNot/.test(
            context.operator
          )
            ? ''
            : '.*'
          let suffix = /endsWith|wordEndsWith|is|isNot/.test(
            context.operator
          )
            ? ''
            : '.*'

          let builtCriteria =
            context.operator === 'regexp'
              ? criteria
              : unidecode(
                  prefix +
                    toSafeRegex(context.caseSensitive)(criteria) +
                    suffix
                )

          return {
            regexp: {
              [fieldName]: builtCriteria,
            },
          }
        }, filterParts),
      },
    }

    if (/doesNotContain|isNot/.test(context.operator)) {
      filter = {
        bool: {
          must_not: filter,
        },
      }
    }

    return filter
  },
}
